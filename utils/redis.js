import { createClient } from 'redis';
import { promisify } from 'util';

/**
  * A redis client setup
  */
class RedisClient {
  /**
    *   Creates a client instance
    */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', err => {
      console.log('Redis Client Error', err);
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }
  
  /**
   * Checks if connection to Redis is Alive
   * @return {boolean} true if connection alive or false if not
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * gets value corresponding to key in redis
   * @key {string} key to search for in redis
   * @return {string}  value of key
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Creates a new key in redis with expiration
   * @key {string} key to be saved
   * @value {string} value to be asigned to key
   * @duration {number} Expiration of key
   * @return {undefined}  No return
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Deletes key
   * @key {string} key to be deleted
   * @return {undefined}  No return
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
