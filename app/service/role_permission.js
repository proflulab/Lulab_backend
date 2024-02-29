/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-29 04:15:18
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-29 15:24:03
 * @FilePath: /Lulab_backend/app/service/role_permission.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// app/service/role.js

const Service = require("egg").Service;

class RoleService extends Service {
  /**
   * Get all permissions for a specific user.
   * @param {String} userId - The ID of the user whose permissions are to be retrieved.
   * @return {Promise<Array>} A promise that resolves to an array of permissions.
   */
  async getUserPermissions(userId) {
    try {
      const user = await this.ctx.model.User.findById(userId)
        .populate("roles")
        .exec();
      if (!user) {
        throw new Error("User not found");
      }

      // Assuming the 'gqlpermissions' are an array of permission strings in the Role model
      const permissions = user.roles.reduce((perms, role) => {
        return perms.concat(role.gqlpermissions);
      }, []);

      // 返回去重后的权限列表
      return [...new Set(permissions)];
    } catch (error) {
      this.ctx.logger.error("Error getting user permissions:", error);
      throw error;
    }
  }

  /**
   * 创建新角色或者更新已有角色的权限
   * @param {String} name - 角色名称
   * @param {Array<String>} permissions - 角色的权限列表
   * @return {Promise<Document>} 返回创建或更新的角色文档
   */
  async createOrUpdateRole(name, permissions) {
    let role = await this.ctx.model.Role.findOne({ name }).exec();
    if (role) {
      // 如果角色已存在，更新权限
      role.gqlpermissions = permissions;
      await role.save();
    } else {
      // 角色不存在，创建新角色
      role = new this.ctx.model.Role({ name, gqlpermissions: permissions });
      await role.save();
    }
    return role;
  }
}

module.exports = RoleService;
