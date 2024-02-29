/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-29 04:03:00
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 04:11:58
 * @FilePath: /Lulab_backend/app/model/role.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  // Define User Schema 定义用户模式
  const RoleSchema = new Schema(
    {
      name: { type: String, unique: true, required: true },
      gqlpermissions: [{ type: String, required: true }],
    },
    { timestamps: true }
  );

  return mongoose.model("Role", RoleSchema, "role");
};
