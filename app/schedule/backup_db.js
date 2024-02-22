/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-02-22 13:57:26
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-22 16:28:27
 * @FilePath: /Lulab_backend/app/schedule/backup_db.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const Subscription = require("egg").Subscription;
const backup = require("mongodb-backup");
const path = require("path");
const moment = require("moment");

class BackupDB extends Subscription {
  // Set the execution interval and other configurations for the scheduled task through the schedule property
  static get schedule() {
    return {
      cron: "0 0 */1 * *", // Cron expression for once a day
      type: "all", // Specify that all workers need to execute
    };
  }

  // subscribe is the function that is actually run when the scheduled task is executed
  async subscribe() {
    // MongoDB connection string
    const uri = this.config.mongoose.url;

    // Backup file storage path
    const backupDir = path.join(__dirname, "..", "backupdb"); // The backup directory path is modified here

    // Perform backup
    backup({
      uri,
      root: backupDir,
      // tar: "dump.tar", // save backup into this tar file
      // collections: [ 'logins' ], // save this collection only
      callback(err) {
        if (err) {
          console.error("Backup failed:", err);
        } else {
          console.log(
            "Backup succeeded:",
            moment().format("YYYY-MM-DD HH:mm:ss")
          );
        }
      },
    });
  }
}

module.exports = BackupDB;
