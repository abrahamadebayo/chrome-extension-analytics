/**
 * Simple in-memory cache implementation
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

// In-memory cache store
const cacheStore: Record<string, CacheEntry<any>> = {};

/**
 * Creates a cached version of an async function
 * 
 * @param fn - The async function to cache
 * @param cacheKey - The key for storing the result
 * @param ttl - Time to live in milliseconds
 * @returns A cached version of the function
 */
export function createCachedRequest<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  cacheKey: string,
  ttl: number = 5 * 60 * 1000 // Default 5 minutes
): (forceRefresh?: boolean, ...args: Args) => Promise<T> {
  
  return async (forceRefresh = false, ...args: Args): Promise<T> => {
    const fullKey = `${cacheKey}:${JSON.stringify(args)}`;
    const now = Date.now();
    const cached = cacheStore[fullKey];
    
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && now - cached.timestamp < ttl) {
      return cached.value;
    }
    
    // Otherwise fetch fresh data
    const result = await fn(...args);
    
    // Cache the result
    cacheStore[fullKey] = {
      value: result,
      timestamp: now
    };
    
    return result;
  };
}

/**
 * Clears the entire cache or entries matching a specific key
 */
export function clearCache(keyPattern?: string): void {
  if (!keyPattern) {
    // Clear all cache
    Object.keys(cacheStore).forEach(key => delete cacheStore[key]);
    return;
  }
  
  // Clear matching keys
  Object.keys(cacheStore)
    .filter(key => key.startsWith(keyPattern))
    .forEach(key => delete cacheStore[key]);
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: Object.keys(cacheStore).length,
    keys: Object.keys(cacheStore)
  };
}
