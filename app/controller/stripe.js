/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-16 17:06:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-17 23:04:42
 * @FilePath: /Lulab_backend/app/controller/stripe.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const { Controller } = require("egg");

class StripeController extends Controller {
  async index() {
    const { ctx, config } = this;
    const { request } = ctx;
    const { key, endpointSecret } = config.stripe;
    const stripe = require("stripe")(key);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        ctx.request.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      // Handle webhook error
      ctx.status = 400;
      ctx.body = `Webhook Error: ${err.message}`;

      return;
    }

    const paymentIntentSucceeded = event.data.object;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        // 1.获取用户信息，获取商品订单信息
        // 2.根据用户信息开通小鹅通对应课程

        // Then define and call a function to handle the event payment_intent.succeeded
        console.log(paymentIntentSucceeded);
        break;
      case "subscription_schedule.canceled":
        // Then define and call a function to handle the event subscription_schedule.canceled
        break;
      case "invoice.upcoming":
        // Then define and call a function to handle the event invoice.upcoming
        break;
      case "charge.captured":
        // Then define and call a function to handle the event charge.captured
        break;
      case "invoice.payment_succeeded":
        // Then define and call a function to handle the event invoice.payment_succeeded
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    ctx.status = 200;
    ctx.body = "Received webhook event successfully";
  }
}

module.exports = StripeController;
