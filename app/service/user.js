/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-02-27 20:13:06
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\d6d5a01\Lulab_backend\app\service\user.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

"use strict";
const Service = require("egg").Service;

/**
 * @description - User service class responsible for handling user-related logic operations.
 * @return {*}
 */
class UserService extends Service {
  /**
   * @description - Creates a new user by saving the user information to the database.
   * @param {Object} userInfo - An object containing the user information, including the name, email, and password.
   * @return {Object} - The created user object, including all the user information.
   */
  async createUser(userInfo) {
    const { ctx } = this;
    try {
      // const user = await ctx.model.User.create(userInfo);
      // return user;
      const userinfo = new ctx.model.User(userInfo);
      const user = await userinfo.save();
      return user;
    } catch (err) {
      ctx.logger.error(err);
      throw err;
    }
  }

  /**
   * @description - Finds a user by their ID.
   * @param {string} userId - The ID of the user.
   * @return {Object|null} - The found user object or null if not found.
   */
  async findUserById(userId) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findById(userId);
      return user;
    } catch (err) {
      ctx.logger.error(err);
      return null;
    }
  }

  /**
   * @description - Finds a user by their ctry_code and mobile number.
   * @param {string} ctry_code - The ctry_code information.
   * @param {string} mobile - The mobile number.
   * @return {Object|null} - The found user object or null if not found.
   */
  async findUserByMobile(ctry_code, mobile) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({
        $or: [{ ctry_code }, { mobile }],
      });
      return user;
    } catch (err) {
      ctx.logger.error(err);
      return null;
    }
  }

  /**
   * @description - Finds a user by their email address.
   * @param {string} email - The email address.
   * @return {Object|null} - The found user object or null if not found.
   */
  async findUserByEmail(email) {
    const { ctx } = this;
    try {
      const user = await ctx.model.User.findOne({ email });
      return user;
    } catch (err) {
      ctx.logger.error(err);
      return null;
    }
  }

  /**
   * @description - Finds all users.
   * @return {Array<Object>|null} - An array of all user objects, or null if no users found.
   */
  async findAllUsers() {
    const { ctx } = this;
    try {
      const users = await ctx.model.User.find();
      return users;
    } catch (err) {
      ctx.logger.error(err);
      throw err;
    }
  }

  /**
   * @description change password by mobile
   * @param {String} ctry_code - The ctry_code information.
   * @param {string} mobile - The mobile number.
   * @param {string} password - new password
   * @return {Object||null} - The found user object or null if not found.
   */
  async mobileupdateUserByPassword(ctry_code, mobile, password) {
    const { ctx } = this;
    try {
      const encrypt = ctx.helper.encrypt(password);
      const users = await ctx.model.User.updateOne(
        { ctry_code, mobile },
        { password: encrypt }
      );
      return users;
    } catch (err) {
      ctx.logger.error(err);
      throw err;
    }
  }

  /**
   * @description change password by email
   * @param {String} email - The user email address
   * @param {String} password - The new password
   * @return {Object||null} - The found user object or null if not found.
   */
  async emailupdateUserByPassword(email, password) {
    const { ctx } = this;
    try {
      const encrypt = ctx.helper.encrypt(password);
      const users = await ctx.model.User.updateOne(
        { email },
        { password: encrypt }
      );
      return users;
    } catch (err) {
      ctx.logger.error(err);
      throw err;
    }
  }
}
module.exports = UserService;
