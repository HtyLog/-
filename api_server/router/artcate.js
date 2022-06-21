const express = require("express")
const router = express.Router()
const artcate_handler = require("../router_handler/artcate")

const expressJoi = require("@escook/express-joi")
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema, add_article_schema } = require("../schema/artcate")

// 使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
const multer = require("multer")
const path = require("path")
const upload = multer({ dest: path.join(__dirname, "../uploads") })

// 获取文章列表
// 初始化路由模块
// 初始化路由处理函数模块
// 获取文章分类列表数据
router.get("/cates", artcate_handler.getArticleCates)

// 新增文章分类
// 定义路由和处理函数
// 验证表单数据
// 查询 分类名称 与 分类别名 是否被占用
// 实现新增文章分类的功能
router.post("/addcates", expressJoi(add_cate_schema), artcate_handler.addArticleCates)

// 根据 Id 删除文章分类
// 定义路由和处理函数
// 验证表单数据
// 实现删除文章分类的功能
router.get("/deletecate/:id", expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

// 根据 Id 获取文章分类数据
// 定义路由和处理函数
// 验证表单数据
// 实现获取文章分类的功能
router.get("/cates/:id", expressJoi(get_cate_schema), artcate_handler.getArtCateById)

// 根据 Id 更新文章分类数据
// 定义路由和处理函数
// 验证表单数据
// 查询 分类名称 与 分类别名 是否被占用
// 实现更新文章分类的功能
router.post("/updatecate", expressJoi(update_cate_schema), artcate_handler.updateCateById)

// 发布新文章
// 初始化路由模块
// 初始化路由处理函数模块
// 使用 multer 解析表单数据
// 验证表单数据
// 实现发布文章的功能
router.post("/add", upload.single("cover_img"), expressJoi(add_article_schema), artcate_handler.addArticle)

module.exports = router
