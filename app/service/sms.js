/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 12:44:06
 * @LastEditors: 杨仕明 63637615+shimingy-zx@users.noreply.github.com
 * @LastEditTime: 2024-02-20 02:02:20
 * @FilePath: \Lulab_backend-1\app\service\sms.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */


const Service = require("egg").Service;
const twilio = require("twilio");
const nodemailer = require("nodemailer");

class smsService extends Service {

  /**
 * @description Send SMS using Twilio
 * @param {String} ctry_code - ctry_code code
 * @param {String} mobile - Mobile number
 * @param {String} message - Message content
 * @return {Boolean} Returns true if the SMS is sent successfully, otherwise throws an error.
 */
  async twilio_SMS(ctry_code, mobile, message) {

    if (!ctry_code || !mobile || !message) {
      throw new Error("ctry_code code, mobile number, and message content are required.");
    }

    const { accountSid, authToken } = this.config.twilio;
    const client = twilio(accountSid, authToken);

    try {
      const result = await client.messages.create({
        body: message,
        from: "+12568575054",
        to: ctry_code + mobile,
      });
      this.ctx.logger.info("SMS sent successfully: " + JSON.stringify(result));
      return true;
    } catch (ex) {
      this.ctx.logger.warn("Failed to send SMS:", ex);
      throw new Error("Failed to send SMS: " + ex.message);
    }
  }


  /**
   * Send Email method
   * @param {Object} mailOptions - An object containing email sending options including sender, recipient, subject, and body content
   * @param {string} mailOptions.from - Sender's email address
   * @param {string} mailOptions.to - Recipient's email address
   * @param {string} mailOptions.subject - Email subject
   * @param {string} mailOptions.text - Email body content
   */
  async nodemailer(mailOptions) {
    // Create a mail transporter
    const transporter = nodemailer.createTransport(this.app.config.mailer);

    // Send the email
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log("Error occurred: " + error.message); // Print error message
      } else {
        console.log("Email sent: " + info.response); // Print success response message
      }
    });
  }


  /**
  * Send mobile verification code.
  * @param {String} ctry_code - ctry_code code
  * @param {String} mobile - Mobile number
  * @param {String} operator - SMS operator
  */
  async sendCode_SMS(ctry_code, mobile, operator) {
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
      const result = await sendSMS.call(this, ctry_code, mobile, message);
      if (result) {
        const cacheKey = `mobileVerify${ctry_code}${mobile}`;
        await ctx.service.cache.set(cacheKey, JSON.stringify(code), 600);
      }
      return true;
    } catch (error) {
      ctx.logger.error("An error occurred while sending the verification code:", error);
      throw new Error("An error occurred while sending the verification code:", error);
    }
  }


  /**
 * Send an email with verification code to the specified account.
 * @param {String} account - The recipient's email address.
 * @param {String} code - The verification code to be sent.
 * @return {Boolean} - True if the email is sent successfully, false otherwise.
 */
  async sendCode_Email(account, code) {
    try {
      const { ctx } = this;

      // Define the email content template
      const emailContent = ctx.renderString(`
          <h1>Dear ${account} User</h1>
          <p style="font-size: 18px;color:#000;">
          Your verification code is:
          <span style="font-size: 20px;color:#f00;">${code}</span>,
          You are currently registering an account on Some Website. Please do not disclose the verification code to others as it may lead to data theft.
          </p>
          <p style="font-size: 1.5rem;color:#999;">This code is valid for 5 minutes. Please do not share it with others!</p>
      `, { account, code });

      // Define the email content
      const emailOptions = {
        from: this.config.mailer.auth.user, // Sender's email address
        to: account, // Recipient's email address
        subject: "Some Website - Email Verification Code", // Email subject
        html: emailContent, // Email content
      };

      // Send the email
      await this.sendEmail(emailOptions); // Pass sender's email and password to the helper method

      return true; // Email sent successfully
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return false; // Email sending failed
    }
  }


  /**
   * @description - Verification code verification for phone or email
   * @param {String} identifier - Identifier (ctry_code + mobile for phone, email for email)
   * @param {String} code - Verification code
   * @param {String} type - Type of verification (mobile or email)
   * @return {Boolean} - True if successful
   */
  async verifyCheck(identifier, code, type) {
    try {
      const { ctx } = this;

      // Validate inputs
      if (!identifier || !code || !type) {
        throw new Error("Identifier, code, and type are required.");
      }

      // Construct cache key securely
      const cacheKey = `${type}Verify${identifier}`;

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
