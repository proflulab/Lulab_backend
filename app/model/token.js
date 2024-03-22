/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 16:49:48
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-22 16:49:57
 * @FilePath: /Lulab_backend/app/model/token.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
"use strict";

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;
  // const uuid = require('uuid/v4');

  // 定义模式：访问令牌（access token）模型
  const TokenSchema = new Schema({
    token: { type: String, unique: true }, // 访问令牌
    expiresAt: { type: Date }, // 访问令牌有效期
    scope: { type: String }, // 授权范围
    clientId: { type: String },
    userId: { type: String },
  });

  return mongoose.model("Token", TokenSchema);
};
