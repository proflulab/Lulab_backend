/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-02-27 20:16:45
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\d6d5a01\Lulab_backend\app\graphql\auth\resolver.js
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

    mobileChangePassword(root, { ctry_code, mobile, code, password }, ctx) {
      return ctx.connector.auth.mobileChangePassword(
        ctry_code,
        mobile,
        code,
        password
      );
    },
    emailChangePassword(root, { email, code, password }, ctx) {
      return ctx.connector.auth.emailChangePassword(email, code, password);
    },
    passwordLogin(root, { ctry_code, mobile, password }, ctx) {
      return ctx.connector.auth.passwordLogin(ctry_code, mobile, password);
    },
  },
};
