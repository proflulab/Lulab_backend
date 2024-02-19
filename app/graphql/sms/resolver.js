/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-19 17:12:02
 * @FilePath: /Lulab_backend/app/graphql/sms/resolver.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = {
  Query: {
    verifySend(root, { mobile, area }, ctx) {
      return ctx.connector.sms.verifySend(mobile, area);
    },
  },

  Mutation: {
    mobileCodeLogin(root, { area, mobile, code }, ctx) {
      return ctx.connector.sms.mobileCodeLogin(area, mobile, code);
    },
  },
};
