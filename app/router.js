/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 15:58:48
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-23 13:44:49
 * @FilePath: /Lulab_backend/app/router.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);

  // OAuth 服务的前端登录页面
  router.get("/authorize", controller.auth2.authorize);

  // 获取授权码
  // authorize 是用来获取授权码的路由
  // 生命周期：getClient --> getUser --> saveAuthorizationCode
  router.all("/user/authorize", app.oAuth2Server.authorize());

  // 通过授权码获取 accessToken
  // token 是用来发放访问令牌的路由
  // 生命周期：getClient --> getAuthorizationCode --> saveToken --> revokeAuthorizationCode
  router.all("/user/token", app.oAuth2Server.token());

  // 通过 accessToken 获取用户信息
  // authenticate 是登录之后可以访问的路由
  // 生命周期：getAccessToken
  router.all("/user/authenticate", app.oAuth2Server.authenticate(), (ctx) => {
    ctx.body = ctx.state.oauth;
  });

  // `ctx.state.oauth` 在控制器中间件之后具有令牌或代码数据。
};
