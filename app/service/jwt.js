/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-03-28 11:09:02
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
   * @param {String} refresh_token - Refresh token for token renewal.
   * @return {Object} Object Refresh the user Access token by refreshing the token
   */
  async refreshAccessToken(refresh_token) {
    const { redis } = this.ctx.service;
    const { secret, expire, refresh_expire } = this.app.config.jwt;
    const authHeader = this.ctx.request.header.authorization;
    const getToken = authHeader.replace(/^Bearer\s+/i, "");
    const exp = await this.verifyToken(getToken);
    const res = await this.verifyToken(refresh_token);
    const now = dayjs().unix();

    if (!res) {
      throw new Error(
        "user Refresh token has been expired please to login again"
      );
    }

    // 判断Access token是否过期?
    if (!exp) {
      const code = await redis.get("blocktoken" + exp.jti);
      if (code) {
        throw new Error("The Access token is Block!");
      }
      const getcached = await redis.get("blocktoken" + getToken);
      const cachedCode = await redis.get("blockretoken" + res.jti);
      if (cachedCode) {
        throw new Error("The Refresh token is Block!");
      }
      // Acccess token是否已刷新
      if (getcached === getToken) {
        throw new Error(
          "This token has expired, please change the token and try again"
        );
      }
      const user = await this.service.user.findUserById(res.uid);
      if (!user) {
        throw new Error("user uid is not fund");
      }
      const newToken = {
        token: await this.createToken(user, secret, expire),
        refresh_token: await this.createToken(user, secret, refresh_expire),
      };

      await redis.set(
        "blocktoken" + getToken,
        JSON.stringify(getToken),
        res.exp - now
      );
      await redis.set(
        "blockretoken" + res.jti,
        JSON.stringify(res.jti),
        res.exp - now
      );
      return newToken;
    }

    const timeout = exp.exp - now;
    const retimeout = res.exp - now;

    if (exp.exp <= 300) {
      const user = await this.service.user.findUserById(res.uid);
      if (!user) {
        throw new Error("user uid is not fund");
      }

      const newToken = {
        token: await this.createToken(user, secret, expire),
        refresh_token: await this.createToken(user, secret, refresh_expire),
      };

      // 将当前refresh token&请求头中的token在5分钟后失效
      setTimeout(async () => {
        await redis.set(
          "blocktoken" + exp.jti,
          JSON.stringify(exp.jti),
          timeout
        );
        await redis.set(
          "blockretoken" + res.jti,
          JSON.stringify(res.jti),
          retimeout
        );
        console.log("new Timeout in 5m");
      }, 5 * 60 * 1000);
      // 将当前token&refresh token存储到redis，设置次token&refresh token在5分钟后失效
      await redis.set("Timeout" + exp.jti, JSON.stringify(exp.jti), timeout);
      await redis.set(
        "reTimeout" + res.jti,
        JSON.stringify(res.jti),
        retimeout
      );
      return newToken;
    }

    const TimeOut = await redis.get("Timeout" + exp.jti);
    const ReTimeOut = await redis.get("reTimeout" + res.jti);

    // 判断token&refresh token是否在5分钟后失效
    if (TimeOut || ReTimeOut) {
      const user = await this.service.user.findUserById(res.uid);
      if (!user) {
        throw new Error("user uid is not fund");
      }

      const code = await redis.get("blocktoken" + exp.jti);
      if (code) {
        throw new Error("The Access token is Block!");
      }
      const cachedCode = await redis.get("blockretoken" + res.jti);
      if (cachedCode) {
        throw new Error("The Refresh token is Block!");
      }

      const newToken = {
        token: await this.createToken(user, secret, expire),
        refresh_token: await this.createToken(user, secret, refresh_expire),
      };

      const jti = await this.verifyToken(newToken.token);
      const rejti = await this.verifyToken(newToken.refresh_token);

      // 将当前刷新的新的token&refresh token在5分钟后失效
      setTimeout(async () => {
        await redis.set(
          "blocktoken" + jti.jti,
          JSON.stringify(jti.jti),
          jti.exp - now
        );
        await redis.set(
          "blockretoken" + rejti.jti,
          JSON.stringify(rejti.jti),
          jti.exp - now
        );
        console.log("Refresh Timeout in 5m");
      }, 40 * 1000);

      // 标记当前刷新的token&refresh token
      await redis.set("Timeout" + jti.jti, JSON.stringify(jti.jti), 300);
      await redis.set("reTimeout" + rejti.jti, JSON.stringify(rejti.jti), 300);
      console.log("Refresh newtoken");
      return newToken;
    }

    const user = await this.service.user.findUserById(res.uid);
    if (!user) {
      throw new Error("user is not fund");
    }

    const code = await redis.get("blocktoken" + exp.jti);
    if (code) {
      throw new Error("The Access token is Block!");
    }
    const cachedCode = await redis.get("blockretoken" + res.jti);
    if (cachedCode) {
      throw new Error("The Refresh token is Block!");
    }

    const newToken = {
      token: await this.createToken(user, secret, expire),
      refresh_token: await this.createToken(user, secret, refresh_expire),
    };

    // 将当前refresh token&请求头中的token在5分钟后失效
    setTimeout(async () => {
      await redis.set("blocktoken" + exp.jti, JSON.stringify(exp.jti), timeout);
      await redis.set(
        "blockretoken" + res.jti,
        JSON.stringify(res.jti),
        retimeout
      );
      console.log("new Timeout in 5m");
    }, 40 * 1000);
    // 将当前token&refresh token存储到redis，设置次token&refresh token在5分钟后失效
    await redis.set("Timeout" + exp.jti, JSON.stringify(exp.jti), 300);
    await redis.set("reTimeout" + res.jti, JSON.stringify(res.jti), 300);

    return newToken;
  }
}

module.exports = JwtService;
