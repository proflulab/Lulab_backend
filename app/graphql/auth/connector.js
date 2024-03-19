/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-03-19 15:05:07
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\e368bc8\Lulab_backend\app\graphql\auth\connector.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const dayjs = require("dayjs");

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

        if (!user) {
          const avatar = `https://api.multiavatar.com/${ctry_code}${mobile}.svg`;
          const password = this.helper.genRandCode(12, "all");

          const role = await this.service.role.findRoleByName("student");

          if (!role) {
            // student角色不存在，需要先创建它或者抛出错误
            throw new Error("Student role not found");
          }

          const roles = role._id;

          const userinfo = {
            ctry_code,
            mobile,
            password,
            avatar,
            roles,
          };
          const user_creat = await this.service.user.createUser(userinfo);
          const { token, refresh_token } = await this.jwt.generateToken(
            user_creat
          );
          return { token, refresh_token, user: user_creat };
        }

        const { token, refresh_token } = await this.jwt.generateToken(user);
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
        const avatar = `https://api.multiavatar.com/${email}.svg`;

        if (!user) {
          const password = this.helper.genRandCode(12, "all");

          const role = await this.service.role.findRoleByName("student");

          if (!role) {
            // student角色不存在，需要先创建它或者抛出错误
            throw new Error("Student role not found");
          }

          const roles = role._id;

          const userinfo = {
            email,
            password,
            avatar,
            roles,
          };

          const user_creat = await this.service.user.createUser(userinfo);
          const { token, refresh_token } = await this.jwt.generateToken(
            user_creat
          );
          return { token, refresh_token, user: user_creat };
        }

        const { token, refresh_token } = await this.jwt.generateToken(user);
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
  async mobileChangePassword(ctry_code, mobile, code, password) {
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
      await this.service.user.mobileupdateUserByPassword(
        ctry_code,
        mobile,
        password
      );
      return { status: "100", msg: "Password reset complete" };
    } catch (error) {
      console.error("Failed to change password:", error);
      throw new Error("Failed to change password:");
    }
  }

  /**
   * @description Change user password
   * @param {String} email - user email address
   * @param {String} code - Verify code
   * @param {String} password - The new password
   * @return {Object} - Object indicating password change status
   */
  async emailChangePassword(email, code, password) {
    // Verify code
    const isValidCode = await this.service.sms.verifyCheck(
      email,
      code,
      "email"
    );
    if (!isValidCode) {
      throw new Error("Invalid verification code");
    }

    // Find user by mobile number
    const user = await this.service.user.findUserByEmail(email);
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
      await this.service.user.emailupdateUserByPassword(email, password);
      return { status: "100", msg: "Password reset complete" };
    } catch (error) {
      console.error("Failed to change password:", error);
      throw new Error("Failed to change password:");
    }
  }

  /**
   * @description user Login by password
   * @param {String} ctry_code - Country code.
   * @param {String} mobile - Mobile number.
   * @param {String} password - user account password
   * @return {Object} - Object containing the generated token, refresh token, and user object.
   */
  async passwordLogin(ctry_code, mobile, password) {
    // Find user by mobile number
    const user = await this.service.user.findUserByMobile(ctry_code, mobile);
    if (!user) {
      throw new Error("User not found");
    }
    try {
      if (this.helper.compare(password, user.password)) {
        const { token, refresh_token } = await this.jwt.generateToken(user);

        // await this.redis.set(user._id, token, 7200);
        return { token, refresh_token, user };
      }
      throw new Error("Password is incorrect. Failed to login.");
    } catch (error) {
      this.logger.error("Error during password verification login:", error);
      throw error;
    }
  }

  /**
   * @description logout by refresh_token
   * @param {String} refresh_token - Refresh token for token renewal.
   * @param {String} token - JWT token for authentication.
   * @return {Object} Object indicating lohOut status
   */
  async logOut(refresh_token, token) {
    if (!refresh_token) {
      throw new Error("Error during logout: refresh_token is null");
    }

    const { exp, jti } = await this.jwt.verifyToken(token);
    const decode = await this.jwt.verifyToken(refresh_token, true);

    const now = dayjs().unix();
    const timeout = exp - now;
    const retimeout = decode.exp - now;

    await this.redis.set("blocktoken" + jti, JSON.stringify(jti), timeout);

    await this.redis.set(
      "blockretoken" + decode.jti,
      JSON.stringify(decode.jti),
      retimeout
    );

    return { status: "200", msg: "the user is logged out" };
  }

  /**
   * @description Refresh user Access token
   * @param {String} refresh_token - Refresh token for token renewal.
   * @return {Object} Object Returns the refreshed user token and refresh token
   */
  async refreshAccessToken(refresh_token) {
    const authHeader = this.ctx.request.header.authorization;
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const exp = await this.jwt.verifyToken(token);
    const res = await this.jwt.verifyToken(refresh_token, true);
    if (exp) {
      throw new Error(
        "User token is still valid and does not need to be refreshed"
      );
    }

    const user = await this.service.user.findUserById(res.uid);
    if (!user) {
      throw new Error("user uid is not fund");
    }
    const code = await this.redis.get("blockretoken" + res.jti);
    if (code) {
      throw new Error("The user's refresh token has been deleted");
    }
    // const { secret, expire } = this.config;
    const result = await this.jwt.refreshAccessToken(user, refresh_token);
    return result;
  }
}

module.exports = LaunchConnector;
