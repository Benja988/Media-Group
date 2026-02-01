// Simple in-memory cache implementation
export class InMemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanupExpired(), 60000);
  }

  set(key: string, value: any, ttl: number = 0): void {
    const expiresAt = ttl > 0 ? Date.now() + (ttl * 1000) : 0;
    this.cache.set(key, { value, expiresAt });
  }

  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return keys.map(key => {
      const value = this.get(key);
      return value ? JSON.stringify(value) : null;
    });
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const matchingKeys: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        matchingKeys.push(key);
      }
    }
    
    return matchingKeys;
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    this.set(key, JSON.parse(value), ttl);
  }

  async delMultiple(keys: string[]): Promise<void> {
    keys.forEach(key => this.cache.delete(key));
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt > 0 && now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  dispose(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// Global cache instance
export const cache = new InMemoryCache();