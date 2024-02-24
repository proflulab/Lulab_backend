# 使用Node.js作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 将依赖文件拷贝到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝应用程序代码到工作目录
COPY . .

# 暴露应用程序运行的端口（如果有需要）
EXPOSE 7001

# 运行启动命令
CMD ["npm", "start"]

