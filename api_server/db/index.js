const mysql = require('mysql') //导入mysql,连接创建数据库，存储数据(用户信息)

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'hty166689437',
    database: 'my_db-01'
})


// 向外暴露-共享db对象
module.exports = db