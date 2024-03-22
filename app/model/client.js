/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 16:48:54
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-22 16:49:05
 * @FilePath: /Lulab_backend/app/model/client.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  // 客户端模型，
  const ClientSchema = new Schema({
    clientId: { type: String, unique: true },
    clientSecret: { type: String },
    redirectUri: { type: String }, // 客户端的回调 URL
    grants: { type: String }, // 授权模式，比如授权码模式
  });

  return mongoose.model("Client", ClientSchema);
};
