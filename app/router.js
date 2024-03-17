/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-02 00:46:17
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-17 00:33:07
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
  router.post("/stripe", controller.stripe.index);
};
