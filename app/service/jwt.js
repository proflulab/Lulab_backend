/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-03-18 11:43:31
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\e368bc8\Lulab_backend\app\service\jwt.js
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

  /**
   * @description
   * Verifies the provided token using JWT (JSON Web Token) strategy.
   * It checks whether the token is valid and, based on the 'isRefresh' flag,
   * selects the appropriate secret for verification.
   * @param {string} token - The token string to verify.
   * @param {boolean} isRefresh - A flag to determine if the refresh secret should be used for verification (default is false).
   * @return {Promise<Object>} - Resolves with the decoded token information if verification is successful.
   * @throws {Error} - Throws an error if the token is missing, or if the verification process fails, including for expired tokens.
   */
  async verifyToken(token, isRefresh = false) {
    const { refresh_secret, secret } = this.app.config.jwt;

    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      await this.app.jwt.verify(token, isRefresh ? refresh_secret : secret);
      const decode = this.app.jwt.decode(token);
      return decode;
    } catch (e) {
      if (e.message === "jwt expired" && !isRefresh) {
        this.ctx.response.body = {
          error: "Fail to auth request due to exception: " + e,
          code: 100,
        };
        // throw new AuthException('令牌过期', 10003);
      }
      this.ctx.response.body = {
        error: "Fail to auth request due to exception: " + e,
        code: 100,
      };
      // throw new AuthException();
    }
  }

  /**
   * @description Refresh user token
   * @param {String} user - The unique identifier of the user.
   * @param {String} refreshToken - Refresh token for token renewal.
   * @return {Object} Object Refresh the user Access token by refreshing the token
   */
  async refreshAccessToken(user, refreshToken) {
    const { secret, expire } = this.app.config.jwt;
    const token = await this.createToken(user, secret, expire);
    return {
      token,
      refresh_token: refreshToken,
    };
  }
}

module.exports = JwtService;
