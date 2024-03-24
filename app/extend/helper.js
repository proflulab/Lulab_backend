/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:40:34
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-19 01:43:23
 * @FilePath: /Lulab_backend/app/extend/helper.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
"use strict";

const bcrypt = require("bcrypt");
const fs = require("fs");

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
   * @param {string} opts - A string containing characters that specify parts to include:
   * 'n' for numbers, 'l' for lowercase, 'u' for uppercase, 's' for special characters,
   * 'all' to include all available characters.
   * @return {string} - Generated random code.
   */
  genRandCode(len, opts) {
    const charset = {
      n: "0123456789",
      l: "abcdefghijklmnopqrstuvwxyz",
      u: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      s: "!@#$%^&*()_+",
    };

    if (!opts || len <= 0) {
      throw new Error("Invalid options or length for random code generation");
    }

    let allowedChars = "";
    if (opts === "all") {
      allowedChars = Object.values(charset).join("");
    } else {
      for (const opt of opts) {
        allowedChars += charset[opt] || "";
      }
    }

    if (!allowedChars) {
      throw new Error("Invalid character set options provided");
    }

    const randomChars = Array.from(
      { length: len },
      () => allowedChars[Math.floor(Math.random() * allowedChars.length)]
    );

    return randomChars.join("");
  },

  /**
   * Validate the format of the provided email address.
   * @param {String} email - The email address to be validated.
   * @return {Boolean} - True if the email format is valid, false otherwise.
   */
  validateEmailFormat(email) {
    // Regular expression for validating email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
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

  //
  /**
   * @description 定义函数根据 ISO 查询电话代码
   * @param {string} iso
   * @return {*}
   */
  getTelCodeByISO(iso) {
    const filePath = `${__dirname}/../public/country_codes.json`;
    const rawData = fs.readFileSync(filePath, "utf-8").trim();
    const countryData = JSON.parse(rawData);
    // 在 countryData 中查找对应 ISO 的国家信息
    const country = countryData.data.find((country) => country.iso === iso);

    // 如果找到对应的国家信息，则返回电话代码；否则返回空字符串
    return country ? country.tel_code : "";
  },
};
