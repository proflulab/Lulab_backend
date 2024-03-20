/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-16 17:06:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-20 17:49:17
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

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        {
          const paymentIntentSucceeded = event.data.object;
          ctx.logger.info(paymentIntentSucceeded);
        }
        // Then define and call a function to handle the event payment_intent.succeeded

        break;
      case "subscription_schedule.canceled":
        {
          const subscriptionScheduleCanceled = event.data.object;
          ctx.logger.info(subscriptionScheduleCanceled);
        }
        // Then define and call a function to handle the event subscription_schedule.canceled
        break;
      case "invoice.upcoming":
        {
          const invoiceUpcoming = event.data.object;
          ctx.logger.info(invoiceUpcoming);
        }
        // Then define and call a function to handle the event invoice.upcoming
        break;
      case "charge.captured":
        {
          const chargeCaptured = event.data.object;
          ctx.logger.info(chargeCaptured);
        }
        // Then define and call a function to handle the event charge.captured
        break;
      case "invoice.payment_succeeded":
        // Then define and call a function to handle the event invoice.payment_succeeded
        {
          const invoicePaymentSucceeded = event.data.object;
          ctx.logger.info(invoicePaymentSucceeded);

          const {
            customer_email,
            customer_name,
            customer_phone,
            customer_address,
          } = invoicePaymentSucceeded;

          const country_code = ctx.helper.getTelCodeByISO(
            customer_address.country
          );
          const phoneNumber = customer_phone.replace(country_code, "");

          const phone = country_code + "-" + phoneNumber;
          const wx_email = customer_email;
          const wx_name = customer_name;
          // 注册小鹅通新用户
          const userInfo = { phone, wx_email, wx_name };
          const xiaoe_user = await ctx.service.xiaoe.registerUser(userInfo);

          // 开通课程权益包
          const user_id = xiaoe_user.data.user_id;

          const datas = {
            user_id,
            data: {
              user_id,
              with_package: 1,
              product_infos: [
                {
                  spu_id: "p_62692d0ee4b09dda126125b5",
                  sku_id: "SKU_MMB_65105998337010pttn24",
                  period: "86400",
                },
              ],
              express: {
                receiver: "",
                phone: phoneNumber,
                province: "",
                city: "",
                county: "",
                detail: "",
              },
            },
          };

          await ctx.service.xiaoe.orderProductPackage(datas);
        }

        break;
      default:
        ctx.logger.info(`Unhandled event type ${event.type}`);
    }

    ctx.status = 200;
    ctx.body = "Received webhook event successfully";
  }
}

module.exports = StripeController;
