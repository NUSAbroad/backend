import { DEFAULT_EXPIRATION, redisClient } from '../database/redis';

async function getOrSetCache(key: string, callback: Function) {
  const result = await redisClient.get(key);

  if (result) return JSON.parse(result);

  const fetchedResult = await callback();

  await redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(fetchedResult));

  return fetchedResult;
}

export { getOrSetCache };
