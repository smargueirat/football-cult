import type { Adapter, AdapterAccount, AdapterUser, VerificationToken } from "next-auth/adapters";
import { randomUUID } from "crypto";
import { getRedis } from "@/lib/redis";

// Minimal Redis-backed Auth.js adapter. Only implements what's actually
// exercised under `strategy: "jwt"` (no server-side session table needed --
// see auth.ts) plus one provider that requires an adapter at all (the
// Resend email/magic-link provider needs somewhere to store verification
// tokens; Google doesn't need an adapter by itself). Deliberately doesn't
// implement createSession/getSessionAndUser/updateSession/deleteSession --
// those are only invoked under `strategy: "database"`, and every Adapter
// method is optional (see @auth/core/adapters.d.ts): unused methods are
// simply never called, not an error.
//
// Schema (all plain JSON strings, no Redis data-structure cleverness needed
// at this scale):
//   user:<id>              -> AdapterUser JSON
//   user:email:<email>     -> <id>                  (lookup index)
//   account:<provider>:<providerAccountId> -> AdapterAccount JSON (includes userId)
//   vtoken:<identifier>:<token> -> VerificationToken JSON, TTL'd so expired
//                                  tokens don't need a manual sweep
//   registered_users        -> Set<email>, the durable "who has ever signed
//                               in" list this whole feature exists for
//                               (future price-drop/newsletter sends read
//                               this, not the ephemeral JWT session).

function serialize(user: AdapterUser): string {
  return JSON.stringify(user);
}

function deserializeUser(raw: string | null): AdapterUser | null {
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  return { ...parsed, emailVerified: parsed.emailVerified ? new Date(parsed.emailVerified) : null };
}

export function RedisAdapter(): Adapter {
  return {
    async createUser(user) {
      const redis = await getRedis();
      const id = randomUUID();
      const newUser: AdapterUser = { ...user, id };
      await redis.set(`user:${id}`, serialize(newUser));
      await redis.set(`user:email:${user.email}`, id);
      await redis.sAdd("registered_users", user.email);
      return newUser;
    },

    async getUser(id) {
      const redis = await getRedis();
      return deserializeUser(await redis.get(`user:${id}`));
    },

    async getUserByEmail(email) {
      const redis = await getRedis();
      const id = await redis.get(`user:email:${email}`);
      if (!id) return null;
      return deserializeUser(await redis.get(`user:${id}`));
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const redis = await getRedis();
      const raw = await redis.get(`account:${provider}:${providerAccountId}`);
      if (!raw) return null;
      const account = JSON.parse(raw) as AdapterAccount;
      return deserializeUser(await redis.get(`user:${account.userId}`));
    },

    async updateUser(partial) {
      const redis = await getRedis();
      const existingRaw = await redis.get(`user:${partial.id}`);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const updated: AdapterUser = { ...existing, ...partial };
      await redis.set(`user:${updated.id}`, serialize(updated));
      if (updated.email && updated.email !== existing.email) {
        await redis.set(`user:email:${updated.email}`, updated.id);
      }
      return updated;
    },

    async linkAccount(account) {
      const redis = await getRedis();
      await redis.set(
        `account:${account.provider}:${account.providerAccountId}`,
        JSON.stringify(account)
      );
    },

    async createVerificationToken(verificationToken: VerificationToken) {
      const redis = await getRedis();
      const key = `vtoken:${verificationToken.identifier}:${verificationToken.token}`;
      const ttlSeconds = Math.max(
        1,
        Math.floor((verificationToken.expires.getTime() - Date.now()) / 1000)
      );
      await redis.set(key, JSON.stringify(verificationToken), { EX: ttlSeconds });
      return verificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      const redis = await getRedis();
      const key = `vtoken:${identifier}:${token}`;
      const raw = await redis.get(key);
      if (!raw) return null;
      await redis.del(key);
      const parsed = JSON.parse(raw);
      return { ...parsed, expires: new Date(parsed.expires) };
    },
  };
}
