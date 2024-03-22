/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-02 00:46:17
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-22 17:05:46
 * @FilePath: /Lulab_backend/config/plugin.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // config/plugin.js
  graphql: {
    enable: true,
    package: "egg-graphql",
  },

  mongoose: {
    enable: true,
    package: "egg-mongoose",
  },

  redis: {
    enable: true,
    package: "egg-redis",
  },

  jwt: {
    enable: true,
    package: "egg-jwt",
  },

  cors: {
    enable: true,
    package: "egg-cors",
  },

  oAuth2Server: {
    enable: true,
    package: "egg-oauth2-server",
  },

  ejs: {
    enable: true,
    package: "egg-view-ejs",
  },
};
