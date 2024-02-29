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
        { name: "student", gqlpermissions: ["test1", "test2", "test3"] },
      ];

      // 遍历角色列表，创建角色
      for (const role of roles) {
        try {
          await this.app.model.Role.create({
            name: role.name,
            gqlpermissions: role.gqlpermissions,
          });
          this.app.logger.info(`角色 ${role.name} 初始化成功`);
        } catch (error) {
          this.app.logger.error(`初始化角色 ${role.name} 失败`, error);
        }
      }
    } else {
      this.app.logger.info("角色已存在，跳过初始化");
    }
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
