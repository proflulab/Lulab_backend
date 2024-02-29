/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-29 02:20:51
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 06:22:56
 * @FilePath: /Lulab_backend/app/middleware/graphql_auth.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

module.exports = (options) => {
  return async function graphqlAuth(ctx, next) {
    // 假设你从请求头中获取到了 Authorization header
    const authHeader = ctx.request.header.authorization;

    if (!authHeader) {
      // ctx.throw(401, "No token detected");
      throw new Error("No token detected");
      // throw new AuthException("令牌过期", 10003);
    }

    // 使用正则表达式匹配Bearer token并提取其中的token值
    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
      // 解析并验证token
      const decoded = await ctx.service.jwt.verifyToken(token);

      if (decoded.roles.length === 0) {
        throw new Error("这个用户没有任何角色无法访问");
      }

      // 假设decoded对象中有一个字段叫role
      const user = {
        role: decoded.roles,
        ...decoded,
      };

      // 将用户信息存储在ctx.state.user中
      ctx.state.user = user;

      // 继续执行后续中间件
      await next();
      return;
    } catch (err) {
      // ctx.throw(401, "Invalid token");
      throw err;
    }
  };
};
