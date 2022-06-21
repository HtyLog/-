// 表单验证的原则：前端验证为辅，后端验证为主，后端永远不要相信前端提交过来的任何内容

// 在实际开发中，前后端都需要对表单的数据进行合法性的验证，
// 而且，后端做为数据合法性验证的最后一个关口，在拦截非法数据方面，起到了至关重要的作用。

// 单纯的使用 if...else... 的形式对数据合法性进行验证，效率低下、出错率高、维护性差。因此，推荐使用第三方数据验证模块
// (npm install @escook/express-joi)，来降低出错率、提高验证的效率与可维护性，让后端程序员把更多的精力放在核心业务逻辑的处理上。

// 安装 joi 包，为表单中携带的每个数据项，定义验证规则：
// 安装 @escook / express-joi 中间件， 来实现自动对表单数据进行验证的功能：

// 导入模块-初始化验证规则
const joi = require('joi')

/**
 * string() 值必须是字符串-字母数字字符
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(3).max(10).required()
    // 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password
    }
}


// 更新用户验证表单的验证规则对象
exports.update_userinfo_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        nickname,
        email
    }
}

exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

exports.update_avatar_schema = {
    body: {
        avatar,
    },
}


exports.find_user_schema = {
    body: {
        username,
    }
}

// 在路由中添加，声明局部中间件，进行数据验证