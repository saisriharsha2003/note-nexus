import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

export const publisher = createClient({ url: redisUrl });
export const subscriber = createClient({ url: redisUrl });

export const connectRedis = async () => {
  try {
    await publisher.connect();
    await subscriber.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
  }
};