/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:44:06
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-19 15:53:16
 * @FilePath: /Lulab_backend/app/service/sms.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */


const twilio = require("twilio");
const Service = require("egg").Service;

class smsService extends Service {

  /**
 * @description Send SMS using Twilio
 * @param {String} area - Area code
 * @param {String} mobile - Mobile number
 * @param {String} message - Message content
 * @return {Boolean} Returns true if the SMS is sent successfully, otherwise throws an error.
 */
  async twilio_SMS(area, mobile, message) {

    if (!area || !mobile || !message) {
      throw new Error("Area code, mobile number, and message content are required.");
    }

    const { accountSid, authToken } = this.config.twilio;
    const client = twilio(accountSid, authToken);

    try {
      const result = await client.messages.create({
        body: message,
        from: "+12568575054",
        to: area + mobile,
      });
      this.ctx.logger.info("SMS sent successfully: " + JSON.stringify(result));
      return true;
    } catch (ex) {
      this.ctx.logger.warn("Failed to send SMS:", ex);
      throw new Error("Failed to send SMS: " + ex.message);
    }
  }


  /**
  * Send mobile verification code.
  * @param {String} area - Area code
  * @param {String} mobile - Mobile number
  * @param {String} operator - SMS operator
  */
  async verifySend(area, mobile, operator) {
    const { ctx } = this;
    const code = ctx.helper.rand(6);
    const message = `Your verification code is: ${code}`;
    const operators = {
      twilio_SMS: this.twilio_SMS,
      // ali_SMS: this.ali_SMS
      // Add more operators as needed
    };


    const sendSMS = operators[operator] || this.twilio_SMS; // Default to twilio_SMS if operator is not supported
    if (!sendSMS) {
      throw new Error("Unsupported operator");
    }

    try {
      const result = await sendSMS.call(this, area, mobile, message);
      if (result) {
        const cacheKey = `mobileVerify-${area}-${mobile}`;
        await ctx.service.cache.set(cacheKey, JSON.stringify(code), 600);
      }
      return true;
    } catch (error) {
      ctx.logger.error("An error occurred while sending the verification code:", error);
      throw new Error("An error occurred while sending the verification code:", error);
    }
  }


  /**
 * @description - Verification code verification
 * @param {String} area - Area code
 * @param {String} mobile - Mobile number
 * @param {String} code - Verification code
 * @return {Boolean} - True if successful
 */
  async verifyCheck(area, mobile, code) {
    try {
      const { ctx } = this;

      // Validate inputs
      if (!area || !mobile || !code) {
        throw new Error("Area, mobile, and code are required.");
      }

      // Construct cache key securely
      const cacheKey = `mobileVerify-${area}-${mobile}`;

      // Get code from cache
      const cachedCode = await ctx.service.cache.get(cacheKey);

      // Compare codes
      if (cachedCode === code) {
        return true;
      }
      return false;

    } catch (error) {
      console.error("Error occurred during verification:", error);
      return false;
    }
  }

}

module.exports = smsService;
