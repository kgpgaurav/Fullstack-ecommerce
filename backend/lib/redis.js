import Redi from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis= new Redi(process.env.REDIS_URL);
await redis.set('foo', 'bar');