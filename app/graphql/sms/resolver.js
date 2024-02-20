/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-02-20 19:41:39
 * @FilePath: /Lulab_backend/app/graphql/sms/resolver.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  Query: {
    verifySend(root, { mobile, ctry_code }, ctx) {
      return ctx.connector.sms.verifySend(mobile, ctry_code);
    },
  },

  Mutation: {
    mobileCodeLogin(root, { ctry_code, mobile, code }, ctx) {
      return ctx.connector.sms.mobileCodeLogin(ctry_code, mobile, code);
    },
    resetPassword(root, { ctry_code, mobile, code, password }, ctx) {
      return ctx.connector.sms.resetPassword(ctry_code, mobile, code, password);
    },
  },
};
