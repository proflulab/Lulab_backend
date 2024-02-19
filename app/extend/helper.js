/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:40:34
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-19 11:15:03
 * @FilePath: /Lulab_backend/app/extend/helper.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  /**
   * Generate a random number with a default length of 6 digits.
   * @param {number} length - Length of the random number
   * @return {string} - Random number
   */
  rand(length = 6) {
    let Num = "";
    for (let i = 0; i < length; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },


  /**
   * @description Generates a random code with custom composition.
   * @param {number} len - Length of the random code.
   * @param {string[]} opts - Options specifying character parts to include, can be any combination of "num", "lower", "upper", "special".
   * @return {string} - Generated random code.
   */
  genRandCode(len, opts) {
    const charset = {
      num: "0123456789",
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      special: "!@#$%^&*()_+",
    };

    let allowedChars = "";
    for (const opt of opts) {
      if (charset.hasOwnProperty(opt)) {
        allowedChars += charset[opt];
      }
    }

    let code = "";
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      code += allowedChars[randomIndex];
    }

    return code;
  },


  /**
   * Encrypt a password using bcrypt.
   * @param {string} password - Password to encrypt
   * @return {string} - Encrypted password hash
   */
  encrypt(password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds); // Generate a salt
    return bcrypt.hashSync(password, salt); // Hash the password (synchronously)
  },

  /**
   * Compare a password with its bcrypt hash.
   * @param {string} password - Password to compare
   * @param {string} hash - Hash to compare against
   * @return {boolean} - True if the password matches the hash, false otherwise
   */
  compare(password, hash) {
    return bcrypt.compareSync(password, hash); // Compare the password with the hash
  },
};
