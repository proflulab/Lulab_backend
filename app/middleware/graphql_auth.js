/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-02 00:48:36
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-03-12 17:41:06
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\bcb57a6\Lulab_backend\app\middleware\graphql_auth.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

module.exports = options => {
  return async function graphqlAuth(ctx, next) {
    // 假设你从请求头中获取到了 Authorization header
    const authHeader = ctx.request.header.authorization;

    if (!authHeader) {
      throw new Error("No token detected");
    }

    // 使用正则表达式匹配Bearer token并提取其中的token值
    const token = authHeader.replace(/^Bearer\s+/i, "");

    try {
      // 解析并验证token
      const decoded = await ctx.service.jwt.verifyToken(token);

      if (!decoded) {
        throw new Error("User token verification failed");
      }

      if (decoded.roles.length === 0) {
        throw new Error("这个用户没有任何角色无法访问");
      }

      const permissions = await ctx.service.role.getUserPermissions(
        decoded.uid
      );

      // 假设decoded对象中有一个字段叫role
      const user = {
        permissions,
        ...decoded,
      };

      // 将用户信息存储在ctx.state.user中
      ctx.state.user = user;

      // 继续执行后续中间件
      await next();
      return;
    } catch (err) {
      throw err;
    }
  };
};
