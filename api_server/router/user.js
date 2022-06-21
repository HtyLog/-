// 用户登录，注册路由模块
const express = require("express")
const userHandle = require("../router_handler/user")

// 导入验证表单的中间件
const expressJoi = require("@escook/express-joi")
// 导入需要验证规则的对象
const { reg_login_schema, find_user_schema } = require("../schema/user")

// 创建路由对象
const router = express.Router()

// 在路由对象上挂载路由——测试
//抽离路由处理函数到router_handler文件夹——纯粹路由模块
router.get("/", userHandle.test)

// 用户路由
// 注册
// 3.验证
// 3.1 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证.
// 3.2 数据验证通过后，会把这次请求流转给后面的路由处理函数.
// 3.3 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误.
// 进入全局错误级别中间件中进行处理——在app.js中设置全局错误级别中间件，捕获错误.
router.post("/reguser", expressJoi(reg_login_schema), userHandle.reguser) // 注册

router.post("/finduser", expressJoi(find_user_schema), userHandle.finduser) // 注册

// 登录
// 1.检测表单数据是否合法.
// 2.根据用户名查询用户的数据——根据body里的username，在数据库查询password是否匹配
// 3.判断用户输入的密码是否正确
// 4.生成 JWT 的 Token 字符串,响应到客户端，作为身份验证信息存储
// 5.在app.js注册路由之前配置解析token字符串的中间件，判断请求是否有访问权限，并解析token字符串，判断用户是否能登录
router.post("/login", expressJoi(reg_login_schema), userHandle.login) //登录

// 向外暴露/共享路由对象
module.exports = router
