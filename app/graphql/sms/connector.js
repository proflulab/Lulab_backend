"use strict";

class LaunchConnector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * 发送验证码
   * @param {String} mobile - 手机号
   * @param {Int} area - 地区
   */
  async verifySend(mobile, area) {
    return await this.ctx.service.sms.verifySend(mobile, area);
  }

  async verifyCheck(mobile, area, code) {
    return await this.ctx.service.sms.verifyCheck(mobile, code, area);
  }
}

module.exports = LaunchConnector;
