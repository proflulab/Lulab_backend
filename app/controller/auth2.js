/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 16:53:12
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-23 13:44:30
 * @FilePath: /Lulab_backend/app/controller/auth2.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const Controller = require("egg").Controller;

class UserController extends Controller {
  // 渲染登录页面
  async authorize() {
    const query = this.ctx.querystring;
    await this.ctx.render("login", {
      title: "Lulab OAuth Account Login",
      query,
    });
  }
}

module.exports = UserController;
