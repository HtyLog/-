// 用户信息路由的处理函数
const { date } = require("joi")
const db = require("../db")
const bcrypt = require("bcryptjs")

// 获取查看用户信息
exports.getUserInfo = function (req, res) {
  // 根据用户的 id，查询用户的基本信息
  // 注意：为了防止用户的密码泄露，需要排除 password 字段
  const sql = "select id,username,nickname,email,user_pic from ev_users where id=? "
  db.query(sql, req.user.id, function (err, results) {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc("未查询到该用户")
    res.send({
      status: 0,
      message: "查询用户基本信息成功",
      data: results[0]
    })
  })
}

// 更新用户信息
exports.updateUserInfo = function (req, res) {
  const sql = "update ev_users set ? where id=?"
  db.query(sql, [req.body, req.user.id], function (err, results) {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc("修改用户信息失败")
    res.cc("修改用户信息成功", 0)
  })
}

// 重置密码实现步骤
exports.updatePassword = function (req, res) {
  const sql = "select * from ev_users where id=?"
  db.query(sql, req.user.id, function (err, results) {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc("用户不存在")
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    // console.log(results[0])
    // console.log(compareResult)
    if (!compareResult) return res.cc("原密码错误")

    const sql_updatepwd = "update ev_users set password=? where id=?"
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sql_updatepwd, [newPwd, req.user.id], function (err, results) {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("更新密码失败")
      res.cc("更新密码成功", 0)
    })
  })
}

// 重置头像
exports.updateAvatar = function (req, res) {
  const sql = "update ev_users set user_pic=? where id=?"
  db.query(sql, [req.body.avatar, req.user.id], function (err, results) {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc("更新头像失败！")
    res.cc("更新头像成功", 0)
  })
}
