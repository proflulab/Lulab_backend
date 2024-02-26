<!--
 * @Author: caohanzhong 342292451@qq.com
 * @Date: 2024-02-20 10:12:46
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-02-26 14:46:23
 * @FilePath: /Lulab_backend/README.md
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
-->

# Lulab_backend

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

运行前请在根目录创建.env 文件，并配置相关环境变量信息

| Parameter          | Description | Example Value | Notes |
| :----------------- | :---------- | :------------ | :---- |
| TWILIO_ACCOUNT_SID | ...         | ...           | ...   |
| ...                | ...         | ...           | ...   |

参考文件.env_example 的内容

### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### install in docker

```bash
git clone -b develop https://github.com/proflulab/Lulab_backend.git
cd Lulab_backend
docker-compose up -d
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

### 相关插件

koroFileHeader 注释辅助插件

代码格式化标准插件 Prettier - Code formatter

[egg]: https://eggjs.org
