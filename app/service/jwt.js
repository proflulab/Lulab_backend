/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-19 12:16:51
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
   * @param {string} userId - The unique identifier of the user.
   * @param {string} secret - The secret key used to sign the JWT.
   * @param {number} expire - The expiration time of the JWT (in seconds).
   * @return {Promise<string>} - Returns a Promise object containing the JWT.
   */
  async createToken(userId, secret, expire) {
    // Parameter validation
    if (!userId || !secret || typeof expire !== "number" || expire <= 0) {
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
      uid: userId,
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
   * @param {string} userId - The user's ID.
   * @return {Object} - An object containing the generated token and refresh_token.
   */
  async generateToken(userId) {
    const { secret, expire, refresh_expire } = this.config.jwt;
    return {
      token: await this.createToken(userId, secret, expire),
      refresh_token: await this.createToken(
        userId,
        secret,
        refresh_expire
      ),
    };
  }

  // 验证 Token
  async verifyToken(token, isRefresh = false) {
    if (!token) {
      this.ctx.response.body = {
        error: "Fail to auth request due to exception: ",
        code: 100,
      };
      return false;
      // throw new AuthException();
    }
    const secret = isRefresh
      ? this.app.config.jwt.refresh_secret
      : this.app.config.jwt.secret;
    try {
      await this.app.jwt.verify(token, secret);
    } catch (e) {
      if (e.message === "jwt expired" && !isRefresh) {
        this.ctx.response.body = {
          error: "Fail to auth request due to exception: " + e,
          code: 100,
        };
        return false;
        // throw new AuthException('令牌过期', 10003);
      }
      this.ctx.response.body = {
        error: "Fail to auth request due to exception: " + e,
        code: 100,
      };
      return false;
      // throw new AuthException();
    }
    return true;
  }

  async refreshToken(refreshToken) {
    const userId = await this.getUserIdFromToken(refreshToken, true);
    if (!userId) {
      return false;
    }
    const token = await this.createToken(
      userId.userid,
      this.app.config.jwt.secret,
      this.app.config.jwt.expire
    );
    return {
      token,
      refresh_token: refreshToken,
    };
  }

  /**
   * @description - 从 Token 中获取用户ID
   * @param {*} token
   * @param {*} isRefresh
   * @return {*}
   */
  getUserIdFromToken(token, isRefresh = false) {
    const result = this.verifyToken(token, isRefresh);
    if (!result) {
      return false;
    }
    const res = this.app.jwt.decode(token);
    return res;
  }

  async reToken(token) {
    if (token === undefined) {
      this.ctx.response.body = { message: "令牌为空，请登陆获取！" };
      this.ctx.status = 401;
      return;
    }
    return token.replace(/^Bearer\s/, "");
  }
}

module.exports = JwtService;
