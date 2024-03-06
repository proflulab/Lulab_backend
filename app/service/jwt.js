/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 06:08:47
 * @FilePath: /Lulab_backend/app/service/jwt.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const Service = require("egg").Service;
const UUID = require("uuid").v4;
const dayjs = require("dayjs");

class JwtService extends Service {
  /**
   * Create a JSON Web Token (JWT) and return it.
   * @description This function is used to create a JSON Web Token (JWT) for user authentication and authorization.
   * @param {string} user - The unique identifier of the user.
   * @param {string} secret - The secret key used to sign the JWT.
   * @param {number} expire - The expiration time of the JWT (in seconds).
   * @return {Promise<string>} - Returns a Promise object containing the JWT.
   */
  async createToken(user, secret, expire) {
    // Parameter validation
    if (!user || !secret || typeof expire !== "number" || expire <= 0) {
      throw new Error("Invalid parameters");
    }

    const now = dayjs().unix();
    const jti = UUID(); // Generate a unique identifier

    const payload = {
      aud: "http://127.0.0.1",
      iss: "", // Configure as per actual scenario
      jti,
      iat: now,
      nbf: now,
      exp: now + expire,
      uid: user._id,
      roles: user.roles,
    };

    try {
      // Sign the JWT using a secure signing algorithm
      const token = await this.app.jwt.sign(payload, secret);
      return token;
    } catch (error) {
      throw new Error("JWT signing failed");
    }
  }

  /**
   * @description - Generates a token and a refresh_token.
   * @param {string} user - The user's ID.
   * @return {Object} - An object containing the generated token and refresh_token.
   */
  async generateToken(user) {
    const { secret, expire, refresh_expire } = this.config.jwt;
    return {
      token: await this.createToken(user, secret, expire),
      refresh_token: await this.createToken(user, secret, refresh_expire),
    };
  }

  // 验证 Token
  async verifyToken(token, isRefresh = false) {
    const { ctx } = this.ctx;
    const { refresh_secret, secret } = this.app.config.jwt;

    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      await this.app.jwt.verify(token, isRefresh ? refresh_secret : secret);
      const user = this.app.jwt.decode(token);
      return user;
    } catch (e) {
      if (e.message === "jwt expired" && !isRefresh) {
        ctx.response.body = {
          error: "Fail to auth request due to exception: " + e,
          code: 100,
        };
        // throw new AuthException('令牌过期', 10003);
      }
      ctx.response.body = {
        error: "Fail to auth request due to exception: " + e,
        code: 100,
      };
      // throw new AuthException();
    }
  }
}

module.exports = JwtService;
