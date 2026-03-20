import { createClient } from "redis";

export const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 19695,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function connectRedis() {
  try {
    await client.connect();
    console.log("Connected to Redis Cloud successfully!");
  } catch (err) {
    console.error("Could not connect to Redis Cloud", err);
  }
}
export default connectRedis;
