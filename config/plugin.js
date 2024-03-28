/*
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-03-16 23:20:46
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-03-28 11:11:45
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\e368bc8\Lulab_backend\config\plugin.js
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
};
