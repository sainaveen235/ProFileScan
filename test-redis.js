const Redis = require('ioredis');

async function testRedis() {
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  try {
    // Test connection
    await redis.set('test', 'Hello Redis!');
    const value = await redis.get('test');
    console.log('Redis connection successful!');
    console.log('Test value:', value);
  } catch (error) {
    console.error('Redis connection failed:', error);
  } finally {
    await redis.quit();
  }
}

testRedis(); 