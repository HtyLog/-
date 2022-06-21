//导入自定义数据库模块
const db = require("../db/index")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../config")

//测试函数
exports.test = function (req, res) {
  console.log(req.body)
  res.send(req.body)
}

// 用户登录\注册函数
// 1.检测用户表单数据是否合法
// 2.检测用户名是否被占用
// 3.检测通过-对密码进行加密处理
// 4.插入新用户
exports.reguser = function (req, res) {
  // 1.检测用户表单数据是否合法——值不为空
  const userinfo = req.body

  //  这里的if判断，用户username和password规范的报错功能，被验证joi中间件和全局错误中间件，和自定义的res.cc中间件取代
  //  所以无需再判断，但错误信息固定为中间件报错的信息格式
  //  if (!userinfo.username || !userinfo.password) {
  //      return res.send({
  //          status: '1(失败)',
  //          message: '用户账号或密码不允许为空'
  //      })
  //  }

  //2.检测用户名是否被占用
  //  定义sql语句
  const sql_check = "select * from ev_users where username=?"
  //  执行query语句查询
  db.query(sql_check, [userinfo.username], function (err, results) {
    if (err) {
      return res.cc("sql err message")
    }
    //  res.send(results.length)
    if (results.length > 0) {
      return res.cc("用户名被占用,results.length > 0")
    }

    //3.检测合法且未被占用：为用户密码加密（bcryptjs），新用户数据存入数据库
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //  return res.send(userinfo.password)

    //  4. 插入新用户——这里写在查询sql的处理函数里面（本来就是一个连续的因果体系，也避免多次响应）
    const sql_add = "insert into ev_users set ?" //常量注意不要重复定义——不管是否重复只要执行了sql就会使id自动加一
    db.query(sql_add, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        return res.cc("影响行数" + results.affectedRows + "")
      }
      //  res.send({
      //      status: 0,
      //      message: '新用户添加成功'
      //  })
      res.cc("新用户添加成功", 0)
    })
  })
}

//  修改用户名， 查重检验
exports.finduser = function (req, res) {
  // 1.检测用户表单数据是否合法——值不为空
  const userinfo = req.body
  //  console.log(userinfo)
  //  这里的if判断，用户username和password规范的报错功能，被验证joi中间件和全局错误中间件，和自定义的res.cc中间件取代
  //  所以无需再判断，但错误信息固定为中间件报错的信息格式
  //  if (!userinfo.username || !userinfo.password) {
  //      return res.send({
  //          status: '1(失败)',
  //          message: '用户账号或密码不允许为空'
  //      })
  //  }
  //2.检测用户名是否被占用
  //  定义sql语句
  const sql_check = "select * from ev_users where username=?"
  //  执行query语句查询
  db.query(sql_check, [userinfo.username], function (err, results) {
    if (err) {
      return res.cc("sql err message")
    }
    //  res.send(results.length)
    if (results.length > 0) {
      return res.cc("用户名被占用,results.length > 0")
    }
    res.send("用户名可用")
  })
}

//  登录接口处理函数
exports.login = function (req, res) {
  // 2.根据用户名查询用户的数据-根据body里的username，在数据库查询password是否匹配
  // 2.1 编写sql字符串(常量也是一个块级作用域，函数外无法用,所以要在定义获取一个)，操作数据库查询结构，得到results数组
  // 2.2 判断，如果失去了出现错误返回错误信息；如果查询成功，但返回的数据为空，返回错误信息，否则才继续_
  const sql = "select * from ev_users where username=?"
  const userinfo = req.body
  db.query(sql, [userinfo.username], function (err, results) {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc("你这用户名也没有注册呀？")
    //  res.send('login ok')

    // 3.判断用户输入的密码是否正确
    // 3.1 获得results数组里的password数据，通过中间件解密——调用bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致，返回值是一个布尔类型
    // 3.2 再判断用户的密码userinfo.username 是否与解密的password相等

    console.log(results[0])
    const conpareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    console.log(conpareResult)

    //  res.send(conpareResult)
    if (conpareResult) {
      // 4.生成 JWT 的 Token 字符串，响应token字符串给客户端
      // 4.1 在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
      const user = { ...results[0], password: "", user_pic: "" }

      //  4.2 用jwt的jwt.sign()方法，把用户信息生成Token字符串
      const tokenStr = jwt.sign(user, config.jwtSecretKey /*配置文件里配置的密码字符串*/, {
        expiresIn: "2h" //token的有效期为2小时
      })
      console.log(tokenStr)
      res.send({
        status: "0",
        message: "登录成功",
        //为了方便客户端直接发送token字符串，所以在服务器进行了拼接
        token: "Bearer" + " " + tokenStr
      })
    } else return res.cc("登录失败")
  })
}
