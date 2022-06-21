// 创建用户信息方面路由-查看用户信息，修改用户基本信息，修改密码，修改头像
const express = require("express")
const userinfo_handler = require("../router_handler/userinfo")
const expressjoi = require("@escook/express-joi")
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require("../schema/user")
const router = express.Router()

// 获取查看用户信息实现步骤
// 初始化路由模块
// 初始化路由处理函数模块
// 获取用户的基本信息
router.get("/userinfo", userinfo_handler.getUserInfo)

// 更新用户信息实现步骤
// 定义路由和处理函数
// 验证表单数据
// 实现更新用户基本信息的功能
router.post("/userinfo", expressjoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码实现步骤
// 定义路由和处理函数
// 验证表单数据
// 实现重置密码的功能
router.post("/updatepwd", expressjoi(update_password_schema), userinfo_handler.updatePassword)

// 更新用户头像实现步骤
// 定义路由和处理函数
// 验证表单数据
// 实现更新用户头像的功能
router.post("/update/avatar", expressjoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router
