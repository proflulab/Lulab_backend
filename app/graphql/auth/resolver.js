/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-22 02:41:53
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

    resetPassword(root, { ctry_code, mobile, code, password }, ctx) {
      return ctx.connector.auth.resetPassword(
        ctry_code,
        mobile,
        code,
        password
      );
    },
  },
};
