/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-22 01:53:32
 * @FilePath: /Lulab_backend/app/service/cache.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Service = require("egg").Service;

class CacheService extends Service {
  /**
   * @description Sets a value in the cache with an optional expiration time.
   * @param {string} key The key to set.
   * @param {*} value The value to set.
   * @param {number} [seconds] Expiration time in seconds.
   */
  async set(key, value, seconds) {
    try {
      if (!this.app.redis) {
        throw new Error("Redis instance is not available.");
      }

      if (!seconds) {
        await this.app.redis.set(key, value);
      } else {
        // Ensure seconds is a valid number
        if (isNaN(seconds) || seconds <= 0) {
          throw new Error("Expiration time must be a positive number.");
        }

        // Use EX parameter to set expiration time in seconds
        await this.app.redis.set(key, value, "EX", seconds);
      }
    } catch (error) {
      console.error("Error setting data in cache:", error.message);
    }
  }

  /**
   * @description Retrieves a value from the cache.
   * @param {string} key The key to retrieve.
   * @return {*} The retrieved value, or undefined if the key doesn't exist.
   */
  async get(key) {
    try {
      if (!this.app.redis) {
        throw new Error("Redis instance is not available.");
      }

      const data = await this.app.redis.get(key);

      if (!data) {
        return undefined;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error("Error retrieving data from cache:", error.message);
      return undefined;
    }
  }

  /**
   * @description Deletes a key from the cache.
   * @param {string} key The key to delete.
   */
  async del(key) {
    try {
      if (!this.app.redis) {
        throw new Error("Redis instance is not available.");
      }

      await this.app.redis.del(key);
    } catch (error) {
      console.error("Error deleting data from cache:", error.message);
    }
  }
}

module.exports = CacheService;
