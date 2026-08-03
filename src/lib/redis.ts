import { createClient, RedisClientType } from "redis";

// Reutilizamos la misma conexión entre invocaciones "calientes" de la
// función serverless en vez de abrir una nueva cada vez.
let client: RedisClientType | undefined;

export function isRedisConfigured() {
  return Boolean(process.env.REDIS_URL);
}

export async function getRedis(): Promise<RedisClientType> {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not set");
  }
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis error:", err));
  }
  if (!client.isOpen) {
    await client.connect();
  }
  return client;
}
