/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-03-22 15:58:48
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-23 12:38:55
 * @FilePath: /Lulab_backend/app.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 准备调用 configDidLoad，
    // 配置文件和插件文件将被引用，
    // 这是修改配置的最后机会。
  }

  configDidLoad() {
    // 配置文件和插件文件已被加载。
  }

  async didLoad() {
    // 所有文件已加载，这里开始启动插件。
  }

  async willReady() {
    // 所有插件已启动，在应用准备就绪前可执行一些操作。

    // 查询数据库中角色数量
    const count = await this.app.model.Role.countDocuments();

    // 如果数据库中没有任何角色，则进行初始化
    if (count === 0) {
      // 定义要初始化的角色及其权限
      const roles = [
        { name: "admin", gqlpermissions: ["*"] },
        {
          name: "student",
          gqlpermissions: [
            "mobileChangePassword",
            "emailChangePassword",
            "test3",
          ],
        },
      ];

      // 遍历角色列表，创建角色
      for (const role of roles) {
        const { name, gqlpermissions } = role;
        try {
          await this.app.model.Role.create({
            name,
            gqlpermissions,
          });
          this.app.logger.info(`角色 ${name} 初始化成功`);
        } catch (error) {
          this.app.logger.error(`初始化角色 ${name} 失败`, error);
        }
      }
    } else {
      this.app.logger.info("角色已存在，跳过初始化");
    }

    // 查询数据库中是否已存在admin超级管理员
    const usercount = await this.app.model.User.countDocuments();
    const adminUser = await this.app.model.User.findOne({ name: "admin" });
    // 如果admin超级管理员不存在，则创建
    if (!adminUser && usercount === 0) {
      const adminRole = await this.app.model.Role.findOne({ name: "admin" });
      if (!adminRole) {
        this.app.logger.error("管理员角色不存在，请先确保角色被正确初始化。");
        return;
      }
      try {
        // 创建admin超级管理员用户
        await this.app.model.User.create({
          email: "admin@admin.com", // 用户名
          password: "admin", // 密码
          roles: [adminRole._id], // 角色ID数组，这里只添加admin角色
          sex: 0, // 性别，如果是必填项，可以设置一个默认值
        });
        this.app.logger.info("超级管理员admin初始化成功");
      } catch (error) {
        this.app.logger.error("初始化超级管理员admin失败", error);
      }
    } else {
      this.app.logger.info("超级管理员admin已存在");
    }

    // const result = await this.app.model.Client.create({
    //   clientId: "123456",
    //   userId: "654321",
    //   clientSecret: "qwerty",
    //   redirectUri: "http://127.0.0.1:7001",
    //   grants: "authorization_code,refresh_token", // 授权模式有两个！！！
    // });
    // console.log(result);
  }

  async didReady() {
    // worker 已准备就绪，在这里可以执行一些操作，
    // 这些操作不会阻塞应用启动。
  }

  async serverDidReady() {
    // 服务器已开始监听。
  }
}

module.exports = AppBootHook;
