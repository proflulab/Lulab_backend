/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-17 16:07:15
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-17 17:33:26
 * @FilePath: /Lulab_backend/app/schedule/xiaoe_token.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const Subscription = require("egg").Subscription;

class XiaoeToken extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "1.5h", // 1.5 h间隔
      type: "all", // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { app, ctx } = this;
    const xiaoeService = ctx.service.xiaoe; // 获取 XiaoeService 实例

    try {
      const { access_token, expires_in } = await xiaoeService.getAccessToken();
      // 将 access_token 存储到合适的地方，例如 Redis
      await app.redis.set("xiaoe_access_token", access_token, "EX", expires_in);
      app.logger.info("Successfully updated access_token");
    } catch (error) {
      app.logger.error(`Error while getting access_token: ${error.message}`);
    }
  }
}

module.exports = XiaoeToken;
