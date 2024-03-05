/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-05 21:25:43
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

    async mobileChangePassword(
      root,
      { ctry_code, mobile, code, password },
      ctx
    ) {
      return ctx.connector.auth.mobileChangePassword(
        ctry_code,
        mobile,
        code,
        password
      );
    },

    async emailChangePassword(root, { email, code, password }, ctx) {
      return ctx.connector.auth.emailChangePassword(email, code, password);
    },

    // todo: 方法访问控制案例
    // async emailChangePassword(root, { email, code, password }, ctx) {
    //   await ctx.app.middleware.graphqlAuth()(ctx, async () => {
    //     const act = await ctx.state.user.permissions;
    //     if (!act.includes("emailChangePassword")) {
    //       throw new Error("You do not have permission to reset password");
    //     }
    //     return ctx.connector.auth.emailChangePassword(email, code, password);
    //   });
    // },

    passwordLogin(root, { ctry_code, mobile, password }, ctx) {
      return ctx.connector.auth.passwordLogin(ctry_code, mobile, password);
    },
  },
};
