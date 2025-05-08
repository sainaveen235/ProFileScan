import { Redis } from 'ioredis';

export class RateLimiter {
  private redis: Redis;
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.windowMs = 60 * 1000; // 1 minute
    this.maxRequests = 10; // 10 requests per minute
  }

  async isRateLimited(ip: string): Promise<boolean> {
    const key = `rate-limit:${ip}`;
    
    try {
      // Get current count
      const count = await this.redis.get(key);
      
      if (!count) {
        // First request in the window
        await this.redis.set(key, 1, 'PX', this.windowMs);
        return false;
      }

      const currentCount = parseInt(count, 10);
      
      if (currentCount >= this.maxRequests) {
        return true;
      }

      // Increment count
      await this.redis.incr(key);
      return false;
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request if rate limiter fails
      return false;
    }
  }

  async getRemainingRequests(ip: string): Promise<number> {
    const key = `rate-limit:${ip}`;
    try {
      const count = await this.redis.get(key);
      return count ? Math.max(0, this.maxRequests - parseInt(count, 10)) : this.maxRequests;
    } catch (error) {
      console.error('Error getting remaining requests:', error);
      return this.maxRequests;
    }
  }
} 