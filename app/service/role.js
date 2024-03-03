/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-29 04:15:18
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-03-03 01:45:49
 * @FilePath: /Lulab_backend/app/service/role.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const Service = require("egg").Service;

class RoleService extends Service {
  /**
   * @description Get all permissions for a specific user.
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

      // Return a deduplicated list of permissions
      return [...new Set(permissions)];
    } catch (error) {
      this.ctx.logger.error("Error getting user permissions:", error);
      throw error;
    }
  }

  /**
   * @description Create a new role or update the permissions of an existing one.
   * @param {String} name - The name of the role.
   * @param {Array<String>} permissions - A list of permissions associated with the role.
   * @return {Promise<Document>} The document of the newly created or updated role.
   */
  async createOrUpdateRole(name, permissions) {
    let role = await this.ctx.model.Role.findOne({ name }).exec();
    if (role) {
      // Update permissions of an existing role
      role.gqlpermissions = permissions;
      await role.save();
    } else {
      // Create a new role with the given permissions
      role = new this.ctx.model.Role({ name, gqlpermissions: permissions });
      await role.save();
    }
    return role;
  }

  /**
   * @description Find a role by its ID.
   * @param {String} roleId - The unique identifier of the role.
   * @return {Promise<Document>} A promise resolving to the role document.
   */
  async findRoleById(roleId) {
    try {
      return await this.ctx.model.Role.findById(roleId);
    } catch (error) {
      this.ctx.logger.error(`Find role by ID failed: ${error}`);
      throw error;
    }
  }

  /**
   * @description Locate a role by its name.
   * @param {String} roleName - The name of the role.
   * @return {Promise<Document>} A promise resolving to the found role document.
   */
  async findRoleByName(roleName) {
    try {
      return this.ctx.model.Role.findOne({ name: roleName });
    } catch (error) {
      this.ctx.logger.error(`Find role by roleName failed: ${error}`);
      throw error;
    }
  }

  /**
   * @description List all roles available in the system.
   * @return {Promise<Array>} A promise resolving to an array of role documents.
   */
  async listRoles() {
    return this.ctx.model.Role.find({});
  }

  /**
   * @description Update the information associated with a role.
   * @param {String} roleId - The unique identifier of the role.
   * @param {Object} roleData - An object containing the new role data.
   * @return {Promise<Document>} A promise resolving to the updated role document.
   */
  async updateRole(roleId, roleData) {
    try {
      return await this.ctx.model.Role.findByIdAndUpdate(roleId, roleData, {
        new: true,
      });
    } catch (error) {
      this.ctx.logger.error(`Update role failed: ${error}`);
      throw error;
    }
  }

  /**
   * @description Delete a role from the system.
   * @param {String} roleId - The unique identifier of the role to be deleted.
   * @return {Promise<Document>} A promise resolving to the document of the deleted role.
   */
  async deleteRole(roleId) {
    try {
      return await this.ctx.model.Role.findByIdAndDelete(roleId);
    } catch (error) {
      this.ctx.logger.error(`Delete role failed: ${error}`);
      throw error;
    }
  }
}

module.exports = RoleService;
