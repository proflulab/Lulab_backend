/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-02-26 15:41:50
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\5d69da8\Lulab_backend\app\graphql\auth\connector.js
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
    this.redis = ctx.service.redis;
    this.jwt = ctx.service.jwt;
  }

  /**
   * Send verification code.
   * @param {String} ctry_code - ctry_code code.
   * @param {String} mobile - Mobile number.
   * @return {Promise} Result of SMS service call.
   */
  async sendSmsCode(ctry_code, mobile) {
    try {
      await this.service.sms.sendCode_SMS(mobile, ctry_code);
      return { status: "200", msg: "已经发送验证码" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send a verification code to the specified email account after validating the email format.
   * @param {String} emailAccount - The email address to which the verification code will be sent.
   * @return {Promise} - Result of the email service call.
   */
  async sendEmailCode(emailAccount) {
    // Validate the email format
    if (!this.helper.validateEmailFormat(emailAccount)) {
      throw new Error(
        "Invalid email format. Please provide a valid email address."
      );
    }

    try {
      // Apply request rate limiting
      await this.ctx.applyRequestLimit(emailAccount, 1, 60);

      // Call the SMS service to send the verification code to the email account
      await this.service.sms.sendCode_Email(emailAccount);

      return {
        status: "200",
        msg: "Verification code has been sent successfully.",
      };
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
        ctry_code + mobile,
        code,
        "mobile"
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

          const userinfo = {
            ctry_code,
            mobile,
            password,
            avatar,
          };
          const user_creat = await this.service.user.createUser(userinfo);
          const { token, refresh_token } = await this.jwt.generateToken(
            user_creat._id
          );
          await this.redis.set(user_creat._id, token, 7200);
          return { token, refresh_token, user: user_creat };
        }

        const { token, refresh_token } = await this.jwt.generateToken(user._id);
        await this.redis.set(user._id, token, 7200);
        return { token, refresh_token, user };
      }
    } catch (error) {
      this.logger.error(
        "Error occurred during email-based verification code login:",
        error
      );
      throw error;
    }
  }

  /**
   * @description Performs email-based verification code login.
   * @param {String} email - User's email address.
   * @param {String} code - Verification code provided by the user.
   * @return {Object} - Object containing the generated token, refresh token, and user object.
   * @property {String} token - JWT token for authentication.
   * @property {String} refresh_token - Refresh token for token renewal.
   * @property {Object} user - User object containing user information.
   */
  async emailCodeLogin(email, code) {
    try {
      const result = await this.service.sms.verifyCheck(email, code, "email");
      if (result) {
        const user = await this.service.user.findUserByEmail(email);
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
          const userinfo = { email, password, avatar };
          const user_creat = await this.service.user.createUser(userinfo);
          const { token, refresh_token } = await this.jwt.generateToken(
            user_creat._id
          );
          console.log(user_creat);
          await this.redis.set(user_creat._id, token, 7200);
          return { token, refresh_token, user: user_creat };
        }

        const { token, refresh_token } = await this.jwt.generateToken(user._id);
        await this.redis.set(user._id, token, 7200);
        return { token, refresh_token, user };
      }
      throw new Error("Invalid verification code.");
    } catch (error) {
      this.logger.error(
        "Error occurred during email-based verification code login:",
        error
      );
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
      ctry_code + mobile,
      code,
      "mobile"
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

  /**
   * @description: user Login by password
   * @param {String} ctry_code - Country code.
   * @param {String} mobile - Mobile number.
   * @param {String} password - user account password
   * @return {Object} - Object containing the generated token, refresh token, and user object.
   */
  async passwordLogin(ctry_code, mobile, password) {
    // Find user by mobile number
    const user = await this.service.user.findUserByMobile(ctry_code, mobile);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }
    try {
      if (this.helper.compare(password, user.password)) {
        const { token, refresh_token } = await this.jwt.generateToken(user._id);

        await this.redis.set(user._id, token, 7200);
        return { token, refresh_token, user };
      }
      throw new Error("Failed to Login for password");
    } catch (error) {
      this.logger.error("Error during password verification login:", error);
      throw error;
    }
  }
}

module.exports = LaunchConnector;
