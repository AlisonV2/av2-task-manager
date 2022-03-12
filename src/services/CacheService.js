import NodeCache from 'node-cache';

export default class CacheService {
  constructor(ttlSeconds) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    return this.cache.set(key, value);
  }

  del(keys) {
    return this.cache.del(keys);
  }

  update(key, value) {
    this.del(key);
    return this.set(key, value);
  }

  flush() {
    this.cache.flushAll();
  }
}
