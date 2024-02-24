#!/bin/bash
###
 # @Author: 杨仕明 shiming.y@qq.com
 # @Date: 2024-02-25 00:20:26
 # @LastEditors: 杨仕明 shiming.y@qq.com
 # @LastEditTime: 2024-02-25 00:51:30
 # @FilePath: /Lulab_backend/start_project.sh
 # @Description: 
 # 
 # Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
### 

# 克隆项目并进入项目目录
git clone -b develop https://github.com/proflulab/Lulab_backend.git

cd Lulab_backend

# 启动项目
docker-compose up -d
