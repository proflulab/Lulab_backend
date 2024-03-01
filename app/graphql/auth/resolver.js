/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 06:19:28
 * @FilePath: /Lulab_backend/app/graphql/auth/resolver.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  Query: {
    sendSmsCode(root, { mobile, ctry_code }, ctx) {
      return ctx.connector.auth.sendSmsCode(mobile, ctry_code);
    },

    sendEmailCode(root, { email }, ctx) {
      return ctx.connector.auth.sendEmailCode(email);
    },
  },

  Mutation: {
    mobileCodeLogin(root, { ctry_code, mobile, code }, ctx) {
      return ctx.connector.auth.mobileCodeLogin(ctry_code, mobile, code);
    },

    emailCodeLogin(root, { email, code }, ctx) {
      return ctx.connector.auth.emailCodeLogin(email, code);
    },

    async mobileChangePassword(root, { ctry_code, mobile, code, password }, ctx) {
      // 首先运行认证中间件
      await ctx.app.middleware.graphqlAuth()(ctx, async () => {
        // if (ctx.state.user.role.includes("resetPassword")) {
        //   throw new Error("You do not have permission to reset password");
        // }

        // 中间件验证通过后，调用connector的resetPassword方法
        return ctx.connector.auth.mobileChangePassword(
          ctry_code,
          mobile,
          code,
          password
        );
      });
    },
    emailChangePassword(root, { email, code, password }, ctx) {
      return ctx.connector.auth.emailChangePassword(email, code, password);
    },
    passwordLogin(root, { ctry_code, mobile, password }, ctx) {
      return ctx.connector.auth.passwordLogin(ctry_code, mobile, password);
    },
  },
};
