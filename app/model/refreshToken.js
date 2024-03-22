/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 16:50:08
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-22 16:50:16
 * @FilePath: /Lulab_backend/app/model/refreshToken.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
"use strict";

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;
  // const uuid = require('uuid/v4');

  // 定义模式：刷新令牌（refresh token）模型
  const RefreshTokenSchema = new Schema({
    token: { type: String, unique: true },
    expiresAt: { type: Date },
    scope: { type: String }, // 授权范围
    clientId: { type: String },
    userId: { type: String },
  });

  return mongoose.model("RefreshToken", RefreshTokenSchema);
};
