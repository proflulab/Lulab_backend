/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-17 17:09:35
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-17 18:56:56
 * @FilePath: /Lulab_backend/app/service/xiaoe.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/service/xiaoe.js

const Service = require("egg").Service;

class XiaoeService extends Service {
  /**
   * @description
   * 参考https://api-doc.xiaoe-tech.com/api_list/get_access_token.html
   * @return {*}
   */
  async getAccessToken() {
    const { app } = this;
    const { appId, clientId, secretKey, grantType } = app.config.xiaoe;

    try {
      const response = await this.ctx.curl("https://api.xiaoe-tech.com/token", {
        method: "GET",
        dataType: "json",
        data: {
          app_id: appId,
          client_id: clientId,
          secret_key: secretKey,
          grant_type: grantType,
        },
      });

      const { code, data, msg } = response.data;
      if (code === 0) {
        const { access_token, expires_in } = data;
        // 返回 access_token 及其过期时间
        return { access_token, expires_in };
      }
      throw new Error(`Failed to get access_token: ${msg}`);
    } catch (error) {
      throw new Error(`Error while getting access_token: ${error.message}`);
    }
  }

  /**
   * @description 注册新用户
   * 参考https://api-doc.xiaoe-tech.com/api_list/user/register.html
   * @param {string} accessToken 专属token
   * @param {object} userInfo 用户信息对象
   * @return {object} 注册结果
   */
  async registerUser(accessToken, userInfo) {
    const url = "https://api.xiaoe-tech.com/xe.user.register/1.0.0";

    try {
      const response = await this.ctx.curl(url, {
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          access_token: accessToken,
          data: userInfo,
        },
      });

      const { code, msg, data: responseData } = response.data;
      if (code === 0) {
        return responseData;
      }
      throw new Error(`Failed to register user: ${msg}`);
    } catch (error) {
      throw new Error(`Error while registering user: ${error.message}`);
    }
  }

  /**
   * @description
   * 参考https://api-doc.xiaoe-tech.com/api_list/start_class/xe_order_delivery_2.0.html
   * @param {object} datas
   * @return {*}
   */
  async orderProductPackage(datas) {
    try {
      const { access_token, user_id, data } = datas;

      const response = await this.ctx.curl(
        "https://api.xiaoe-tech.com/xe.order.delivery/2.0.0",
        {
          method: "POST",
          dataType: "json",
          data: {
            access_token,
            user_id,
            data,
          },
        }
      );

      return response.data;
    } catch (error) {
      // 处理错误
      this.ctx.logger.error(`Error ordering product package: ${error.message}`);
      throw new Error(`Error ordering product package: ${error.message}`);
    }
  }

  // 可以添加其他小鹅通接口的调用方法
}

module.exports = XiaoeService;
