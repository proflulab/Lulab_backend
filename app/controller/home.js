/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-02 00:46:17
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-23 13:47:20
 * @FilePath: /Lulab_backend/app/controller/home.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const { Controller } = require("egg");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "hi, 这里是陆向谦实验室";
  }
}

module.exports = HomeController;
