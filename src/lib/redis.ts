import { createClient, RedisClientType } from "redis";

export function isRedisConfigured() {
  return Boolean(process.env.REDIS_URL);
}

// Serverless-safe singleton: Next.js can reuse the same Node process
// across requests, so caching the connection (as a promise, not just the
// client) avoids opening a new TCP connection to Redis on every request
// and avoids a race where two requests both see "not yet connected" and
// both call connect().
let clientPromise: Promise<RedisClientType> | null = null;

export function getRedis(): Promise<RedisClientType> {
  if (!clientPromise) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("REDIS_URL is not set");
    }
    const client: RedisClientType = createClient({ url });
    client.on("error", (err) => console.error("Redis client error", err));
    clientPromise = client.connect().then(() => client);
  }
  return clientPromise;
}
