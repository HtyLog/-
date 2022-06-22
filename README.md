# 大事件项目 #
## 项目介绍 ##
* 该项目包括大事件项目的web服务器和api服务器
* api服务器连接mysql数据库（相关的数据结构需要自己查看定义）

## 项目运行 ##
1. 下载大事件文件夹
2. 查阅接口文档的数据结构，建立mysql数据库：https://www.showdoc.cc/escook?page_id=3707158761215217 
4. 在`api_sercer/db/index.js`，链接自己建立好的mysql
5. 终端输入`npm i`安装两个服务器的依赖包
6. 运行web服务器和api服务器`node app.js/web_server.js `
