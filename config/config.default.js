/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:40:34
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-25 17:05:39
 * @FilePath: /Lulab_backend/config/config.default.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

/* eslint valid-jsdoc: "off" */
require("dotenv").config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.cluster = {
    listen: {
      path: "",
      port: parseInt(process.env.NODEJS_PORT),
      hostname: "127.0.0.1",
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1707728659079_3630";

  // add your middleware config here
  config.middleware = ["graphql"];

  config.graphql = {
    router: "/graphql",
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
    // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
    graphiql: true,
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    expire: 7200, // 2小时
    refresh_expire: 259200, // 3天
    secret: process.env.JWT_SECRET,
    ignore: ["/api/registered", "/api/login"], // 哪些请求不需要认证
    // expiresIn: '24h',
  };

  config.cors = {
    origin: "*", // 跨任何域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS", // 被允许的请求方式
  };

  config.mongoose = {
    url: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/?authSource=admin`,
    options: {},
  };

  config.redis = {
    client: {
      port: process.env.REDIS_PORT, // Redis port
      host: process.env.REDIS_HOST, // Redis host
      password: "auth",
      db: 0,
    },
  };

  // add your ext config here
  const extConfig = {
    // Download the helper library from https://www.twilio.com/docs/node/install
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },

    // Email service configuration
    mailer: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      // service: "Gmail", // Use Gmail as the mail service
      auth: {
        user: process.env.EMAIL_USER, // Sender's email address
        pass: process.env.EMAIL_PASS, // Sender's email password
      },
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...extConfig,
    ...userConfig,
  };
};
