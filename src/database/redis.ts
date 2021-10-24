import Redis from 'ioredis';
import { REDIS_URL } from '../consts';

const DEFAULT_EXPIRATION = 3600;
const redisClient = new Redis(REDIS_URL);

export { redisClient, DEFAULT_EXPIRATION };
