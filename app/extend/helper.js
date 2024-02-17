"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  /**
   * 生成*位随机数 默认为6位
   * @param {Int} length 随机数长度
   * @return {String} Num
   */
  rand(length = 6) {
    let Num = "";
    for (let i = 0; i < length; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },

  genRandomPwd() {
    return Math.random().toString(36).substring(2, 10);
  },

  encrypt(password) {
    const salt = bcrypt.genSaltSync(10); // 加盐
    const hash = bcrypt.hashSync(password, salt); // 哈希（同步调用）
    return hash;
  },

  compare(password, hash) {
    return bcrypt.compareSync(password, hash); // 比对
  },
};
