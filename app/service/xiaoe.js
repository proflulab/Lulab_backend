/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-17 17:09:35
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-19 17:10:43
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
   * @param {object} userInfo 用户信息对象
   * @return {object} 注册结果
   */
  async registerUser(userInfo) {
    const url = "https://api.xiaoe-tech.com/xe.user.register/1.0.0";
    const { redis } = this.ctx.service;
    const access_token = await redis.get("xiaoe_access_token");

    try {
      const response = await this.ctx.curl(url, {
        method: "POST",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          access_token,
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
      let maxRetries = 0;
      const { user_id, data } = datas;
      const { redis } = this.ctx.service;
      const access_token = await redis.get("xiaoe_access_token");

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

      const handledData = this.handleResponse(response);
      if (handledData.success) {
        return response.data;
      } else if (handledData.code === 2008) {
        // 检查是否达到最大重试次数
        if (maxRetries < 2) {
          maxRetries = maxRetries + 1;
          // 递归调用并增加重试计数器
          this.getAccessToken();
          return this.orderProductPackage(datas);
        }
        // 已达到最大重试次数，抛出错误
        throw new Error(`Maximum retries (${maxRetries}) exceeded`);
      }
      throw new Error(`报错: ${handledData.errorMessage}`);
      // 注册失败，根据 errorCode 和 errorMessage 进行相应的处理
    } catch (error) {
      // 处理错误
      this.ctx.logger.error(`Error ordering product package: ${error.message}`);
      throw new Error(`Error ordering product package: ${error.message}`);
    }
  }

  // 可以添加其他小鹅通接口的调用方法

  /**
   * 根据全局返回码处理接口返回数据
   * https://api-doc.xiaoe-tech.com/common_problem/code.html
   * @param {object} responseData 接口返回的数据对象
   * @return {object} 处理后的数据对象
   */
  handleResponse(responseData) {
    const { code, msg, data } = responseData;

    if (code === 0) {
      // 正常情况
      return { success: true, data };
    } else if (code < 0) {
      // 签名、权限等异常
      return { success: false, errorCode: code, errorMessage: msg };
    }
    // 业务接口异常
    switch (code) {
      case 1001:
        return { success: false, errorCode: code, errorMessage: "系统繁忙" };
      case 1002:
        return {
          success: false,
          errorCode: code,
          errorMessage: "业务接口返回值格式错误",
        };
      case 2001:
        return {
          success: false,
          errorCode: code,
          errorMessage: "缺失 app_id 参数",
        };
      case 2002:
        return {
          success: false,
          errorCode: code,
          errorMessage: "错误 app_id 参数",
        };
      case 2003:
        return {
          success: false,
          errorCode: code,
          errorMessage: "缺失 secret_key 参数",
        };
      case 2004:
        return {
          success: false,
          errorCode: code,
          errorMessage:
            "secret_key 错误，或者 app_id 无效。请开发者认真比对 app_id,secret_key 的正确性",
        };
      case 2005:
      case 2006:
        return {
          success: false,
          errorCode: code,
          errorMessage: "缺失 grant_type 参数",
        };
      case 2007:
        return {
          success: false,
          errorCode: code,
          errorMessage: "缺失 凭证access_token",
        };
      case 2008:
        return {
          success: false,
          errorCode: code,
          errorMessage: "access_token 过期 或者不存在",
        };
      case 2009:
        return {
          success: false,
          errorCode: code,
          errorMessage: "缺失 userid 参数",
        };
      case 2010:
        return {
          success: false,
          errorCode: code,
          errorMessage: "user_id 无效",
        };
      case 2017:
        return {
          success: false,
          errorCode: code,
          errorMessage: "没有请求本接口的权限，请申请对应接口权限集",
        };
      case 2020:
        return {
          success: false,
          errorCode: code,
          errorMessage: "无效的client_id",
        };
      case 2051:
        return {
          success: false,
          errorCode: code,
          errorMessage: "IP 没有添加白名单，需用用户配置服务器白名单ip",
        };
      case 2052:
        return {
          success: false,
          errorCode: code,
          errorMessage:
            "没有提供该API，用户请求的url错误，或者改url没有在系统中注册",
        };
      case 2053:
        return {
          success: false,
          errorCode: code,
          errorMessage: "API的调用次数达到上线",
        };
      case 2054:
        return {
          success: false,
          errorCode: code,
          errorMessage: "API的请求短时间突增",
        };
      case 2055:
        return {
          success: false,
          errorCode: code,
          errorMessage: "API请求方式错误",
        };
      default:
        return { success: false, errorCode: code, errorMessage: "未知错误" };
    }
  }
}

module.exports = XiaoeService;
