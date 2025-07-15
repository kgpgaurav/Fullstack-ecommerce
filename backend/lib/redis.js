//import Redis from "ioredis"
import { Redis } from '@upstash/redis'
import dotenv from "dotenv"

dotenv.config();

export const redis = new Redis({
  url: 'https://finer-gazelle-46869.upstash.io',
  token: 'AbcVAAIjcDFiYzg1NjRiOTZlOTY0MGI5OThhODY4Y2FjNjM4NGY3YXAxMA',
})
// await redis.set('foo', 'bar');

//export const redis = new Redis("redis://default:AbcVAAIjcDFiYzg1NjRiOTZlOTY0MGI5OThhODY4Y2FjNjM4NGY3YXAxMA@finer-gazelle-46869.upstash.io:6379");
