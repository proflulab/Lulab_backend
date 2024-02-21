/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-22 01:52:59
 * @FilePath: /Lulab_backend/app/graphql/sms/connector.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

class LaunchConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.service = ctx.service;
    this.helper = ctx.helper;
    this.logger = ctx.logger;
    this.cache = ctx.service.cache;
    this.jwt = ctx.service.jwt;
  }

  /**
   * Send verification code.
   * @param {String} ctry_code - ctry_code code.
   * @param {String} mobile - Mobile number.
   * @return {Promise} Result of SMS service call.
   */
  async verifySend(ctry_code, mobile) {
    try {
      await this.service.sms.verifySend(mobile, ctry_code);
      return { status: "200", msg: "已经发送验证码" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Check verification code.
   * @param {String} ctry_code  - ctry_code code.
   * @param {String} mobile - Mobile number.
   * @param {String} code - Verification code.
   * @return {Object} - Object containing the generated token, refresh token, and user object.
   */
  async mobileCodeLogin(ctry_code, mobile, code) {
    try {
      const result = await this.service.sms.verifyCheck(
        ctry_code,
        mobile,
        code
      );
      if (result) {
        const user = await this.service.user.findUserByMobile(
          ctry_code,
          mobile
        );
        const avatar =
          "https://thirdwx.qlogo.cn/mmopen/vi_32/fQUKriaznXjSickA5AchQll4Adj5v4SqZ5IaCbRXSpqOXZClyUrcp66wJANy6ygtvDLhJqfWgPfA0BWNQUAFAKzA/132";

        if (!user) {
          const randPwd = this.helper.genRandCode(12, [
            "num",
            "lower",
            "upper",
            "special",
          ]);
          const password = this.helper.encrypt(randPwd);

          const userinfo = { ctry_code, mobile, password, avatar };
          const user_creat = await this.service.user.createUser(userinfo);
          const { token, refresh_token } = await this.jwt.generateToken(
            user_creat._id
          );
          await this.cache.set(result._id, token, 7200);
          return { token, refresh_token, user: user_creat };
        }

        const { token, refresh_token } = await this.jwt.generateToken(user._id);
        await this.cache.set(user._id, token, 7200);
        return { token, refresh_token, user };
      }
    } catch (error) {
      this.logger.error("", error);
      throw error;
    }
  }

  /**
   * @description Change user password
   * @param {String} ctry_code - Country code.
   * @param {String} mobile - Mobile number.
   * @param {String} code - Verification code.
   * @param {String} password - New password
   * @return {Object} - Object indicating password change status
   */
  async resetPassword(ctry_code, mobile, code, password) {
    // Verify code
    const isValidCode = await this.service.sms.verifyCheck(
      ctry_code,
      mobile,
      code
    );
    if (!isValidCode) {
      throw new Error("Invalid verification code");
    }

    // Find user by mobile number
    const user = await this.service.user.findUserByMobile(ctry_code, mobile);
    if (!user) {
      throw new Error("User not found");
    }

    // Compare new password with old password
    const isSamePassword = this.helper.compare(password, user.password);
    if (isSamePassword) {
      throw new Error(
        "The new password cannot be the same as the old password"
      );
    }

    try {
      // Update user password
      await this.service.user.updateUserByPassword(ctry_code, mobile, password);
      return { status: "100", msg: "Password reset complete" };
    } catch (error) {
      console.error("Failed to change password:", error);
      throw new Error("Failed to change password:");
    }
  }
}

module.exports = LaunchConnector;
