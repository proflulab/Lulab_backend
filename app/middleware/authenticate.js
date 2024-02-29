/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-28 01:19:29
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 04:26:23
 * @FilePath: /Lulab_backend/app/middleware/authenticate.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

module.exports = (options) => {
  return async function authenticate(ctx, next) {
    const url = ctx.url;
    if (url === ctx.app.config.graphql.router) {
      await next();
      return;
    }

    // todo: 预留给restful接口全局中间件
  };
};
