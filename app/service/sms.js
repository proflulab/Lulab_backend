// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
// 引入 Twilio 模块
const twilio = require('twilio');
require('dotenv').config();
// 创建 Twilio 客户端实例
      const ACcountSid = process.env.TWILIO_ACCOUNT_SID;
      const AuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(ACcountSid, AuthToken);
const Service = require('egg').Service;

class smsService extends Service {
    // 定义发送短信的函数
async  sendSMS(mobile, code, area) {
    try {
        const message = `您的验证码是：${code}`;
        // 使用 Twilio 客户端发送短信
        const result = await client.messages.create({
            body: message,
            from: '+12568575054',
            to: area+mobile,
        });

        console.log('短信发送成功：', result.sid);
        console.log(JSON.stringify(result))
        return {
          status: '100',
          msg: '发送成功',
        } 
    
 } catch (ex) {
        console.log('短信发送失败：', ex.message);
        return {
          status: ex.code,
          msg: ex.message,
      };
    }
}
    /**
     * 验证码发送
     * 验证码 5 分钟内有效
     * 待解决：area未测试
     * @param {String} mobile 
     * @param {Int} area 
     * @returns 验证码发送状态RES -> {status, message}
     */
    async verifySend(mobile, area) {
      const code = this.ctx.helper.rand(6);
      const result = await this.sendSMS(mobile, code, area);
      if (result.status === '100') {
        await this.ctx.service.cache.set('mobileVerify ' + area + ' ' + mobile, JSON.stringify(code), 600);
    }
      return result
  }

  /**
   * 验证码校验（已完成）
   * @param {String} mobile
   * @param {Int} code   
   * @param {Int} area
   * @returns 输入验证码是否正确
   */ 
  async verifyCheck(mobile, code, area) {
    const {ctx} = this;
    const getcode = await ctx.service.cache.get('mobileVerify ' + area + ' ' + mobile);
      if (getcode && getcode === code) {
        const result = await ctx.service.user.createAccount(mobile, area)
        if(result && result.status === '100'){
        const Token = await ctx.service.jwt.generateToken(result._id)
          return {status: '100 ',msg: '验证码正确,注册成功',token: Token.token, reToken: Token.refresh_token, data: result.data}
        }
        return result
      }
      return {status: '400', msg: '验证码输入错误', token: null ,reToken: null ,data: null};
  }
}

module.exports = smsService;




