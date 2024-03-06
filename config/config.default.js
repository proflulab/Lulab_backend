/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:40:34
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-05 21:28:10
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

  const {
    NODEJS_PORT,
    JWT_SECRET,
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_PORT,
    MONGODB_DATABASE,
    REDIS_PORT,
    REDIS_HOST,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  config.cluster = {
    listen: {
      path: "",
      port: parseInt(NODEJS_PORT),
      hostname: "0.0.0.0",
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
    secret: JWT_SECRET,
    ignore: ["/api/registered", "/api/login"], // 哪些请求不需要认证
    // expiresIn: '24h',
  };

  config.cors = {
    origin: "*", // 跨任何域
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS", // 被允许的请求方式
  };

  config.mongoose = {
    url: `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}?authSource=admin`,
    options: {},
  };

  config.redis = {
    client: {
      port: REDIS_PORT, // Redis port
      host: REDIS_HOST, // Redis host
      password: null,
      db: 0,
    },
  };

  // add your ext config here
  const extConfig = {
    // Download the helper library from https://www.twilio.com/docs/node/install
    // Find your Account SID and Auth Token at twilio.com/console
    // and set the environment variables. See http://twil.io/secure
    twilio: {
      accountSid: TWILIO_ACCOUNT_SID,
      authToken: TWILIO_AUTH_TOKEN,
    },

    // Email service configuration
    mailer: {
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      // service: "Gmail", // Use Gmail as the mail service
      auth: {
        user: EMAIL_USER, // Sender's email address
        pass: EMAIL_PASS, // Sender's email password
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
