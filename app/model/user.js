/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-17 10:13:58
 * @LastEditors: caohanzhong 342292451@qq.com
 * @LastEditTime: 2024-02-25 08:44:20
 * @FilePath: \Lulab_backendd:\develop_Lulab_backend\Lulab_backend_develop\5d69da8\Lulab_backend\app\model\user.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // Define User Schema 定义用户模式
  const UserSchema = new Schema(
    {
      // Username 用户名
      name: { type: String, unique: true },
      // Nickname 昵称
      nickname: { type: String, unique: true },
      // Real Name 真实姓名
      real_name: { type: String },
      // Password 密码
      password: { type: String, required: true },
      // Gender (0: Unknown, 1: Male, 2: Female) 性别 (0：未知，1: 男，2: 女)
      sex: { type: Number, required: true, default: 0 },
      // Email 电子邮件
      email: { type: String, unique: true },
      // Mobile Phone 手机号码
      mobile: { type: String },
      // Country Code 手机国家区号
      ctry_code: { type: String },
      // Avatar 头像
      avatar: { type: String, required: true, default: "" },
      // Whether the user is blocked 是否被封锁
      blocked: { type: Boolean, default: false },
      // Description 描述
      description: { type: String },
      // Last login time 最后登录时间
      lastLoginAT: { type: Number, default: Date.now, required: true },
    },
    { timestamps: true }
  );

  // 创建复合唯一索引
  UserSchema.index({ mobile: 1, ctry_code: 1 }, { unique: true });

  return mongoose.model("User", UserSchema, "user");
};
