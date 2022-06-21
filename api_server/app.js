// 导入模块
const express = require("express") // 导入express模块——包
const cors = require("cors") // 配置cors跨域:npm i cors@2.8.5——包
const Joi = require("joi")
const expressJWT = require("express-jwt") //解析token字符串的中间件
const { UnauthorizedError } = require("express-jwt")
const config = require("./config") //自定义的配置中间件，里面有定义的token的解密密匙
// 导入路由模块
const userRouter = require("./router/user") // 导入路由模块——自定义用户注册登录模块
const userinfoRouter = require("./router/userinfo") // 导入路由模块——自定义用户信息模块
const artCateRouter = require(".//router/artcate") //导入文章分类路由模块

// 创建app服务器实例
const app = express()

// 注册全局中间件
// 响应数据的中间件：在处理函数中，需要多次调用 res.send() 向客户端响应 处理失败 的结果，为了简化代码，可以手动封装一个 res.cc() 函数
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
app.use(cors()) //跨域请求中间件
app.use(express.urlencoded({ extended: false })) //解析表单数据中间件：x-www-form
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
app.use("/uploads", express.static("./uploads"))

//在路由之前配置解析token字符串的中间件
// 有访问权限的，如果没有token就会直接报错，无法进入之后的路由，进行相关的处理和响应
app.use("/api", userRouter) //注册路由模块-检测请求先经过全局中间件路由匹配-处理
app.use("/my", userinfoRouter)
app.use("/my/article", artCateRouter)

// 静态托管资源
app.use("/api", express.static("./src"))
// 设置全局错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof Joi.ValidationError) return res.cc(err)

  // 捕获并处理-Token认证失败的错误
  if (err.name === "UnauthorizedError") return res.send("身份认证失败")
  // 未知错误
  res.cc(err)
})

app.listen(1010, function () {
  console.log("API-Sever is running at http://127.0.0.1:1010")
})
