'use strict';

const Service = require('egg').Service;
const Helper = require('../extend/helper.js');

class UserService extends Service {

//登入校验+注册（手机号）
  async createAccount(mobile , area ,password, email) {
    const { ctx } = this;
    // 注册判断是否存在
    const corr = await ctx.model.User.findOne({
      $or: [
        { area: area },
        { mobile: mobile },
    ],
    });
    console.log(corr)
    if(!corr) {
      console.log("用户注册成功")
      console.log("用户信息：", corr)
      const course = await ctx.model.User.create({
        mobile: mobile,
        area: area,
        password: Helper.encrypt(Helper.genRandomPwd()),
        email: email,
      });
      const result = await course.save();
      console.log(result);
      console.log(result._id)
      const Token = await ctx.service.jwt.generateToken(result._id);
      // 将生成的Token返回给前端
      ctx.body = '注册成功';
      console.log('注册成功')
      return { status: '100', msg: '注册成功',token: Token.token ,retoken: Token.refresh_token, data: result };
    } 
    ctx.body = '该用户已注册'
    console.log("该用户已注册,可选择登入")
    const Token = await ctx.service.jwt.generateToken(corr._id);
      // 将生成的Token返回给前端
    return { status: '200', msg: '此账号已注册，已选择登入', token: Token.token ,retoken: Token.refresh_token, data: corr};
  }
}

module.exports = UserService;
