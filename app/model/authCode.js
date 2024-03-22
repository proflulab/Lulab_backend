/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 16:49:31
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-22 16:53:28
 * @FilePath: /Lulab_backend/app/model/authCode.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;
  // const uuid = require('uuid/v4');

  // 定义模式：授权码（authorization code）模型
  const AuthCodeSchema = new Schema({
    code: { type: String }, // 授权码
    expiresAt: { type: Date }, // 授权码有效期
    redirectUri: { type: String }, // 客户端回调 URL
    scope: { type: String }, // 授权范围
    clientId: { type: String },
    userId: { type: String },
  });

  return mongoose.model("AuthCode", AuthCodeSchema);
};
