/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:40:34
 * @LastEditors: 杨仕明 63637615+shimingy-zx@users.noreply.github.com
 * @LastEditTime: 2024-02-20 04:08:30
 * @FilePath: \Lulab_backend-1\app\extend\context.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";


module.exports = {

  /**
 * Apply request rate limiting for the specified user email account.
 * @param {String} account - The email address of the user.
 * @param {Number} limit - The maximum number of requests allowed per day.
 * @param {Number} duration - The duration in seconds for the limit to be enforced.
 * @return {Boolean} - Returns true if the request is allowed, false otherwise.
 */
  async applyRequestLimit(account, limit, duration) {
    const userKey = `request_limit_${account}`;

    const requestCount = await this.service.redis.get(userKey) || 0;

    if (requestCount >= limit) {
      throw new Error("Access temporarily blocked. Please try again later.");
    }

    await this.service.redis.set(userKey, requestCount + 1, duration);

    return true;
  },

};
