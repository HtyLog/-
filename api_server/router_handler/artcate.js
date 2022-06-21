// 获取文章列表处理函数
const db = require("../db/index")
const path = require("path")

exports.getArticleCates = function (req, res) {
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // is_delete 为 0 表示没有被 标记为删除 的数据
  const sql = "select * from ev_article_cate where is_delete=0 order by id asc"
  db.query(sql, function (err, results) {
    if (err) return res.cc(err)
    if (results == 0) return res.cc("未查到数据")
    res.send({
      status: 0,
      message: "获取文章分类列表成功",
      data: results
    })
  })
}

// 新增文章分类
exports.addArticleCates = function (req, res) {
  // 定义查重的sql语句
  const sql = "select * from ev_article_cate where name=? or alias=?"
  db.query(sql, [req.body.name, req.body.alias], function (err, results) {
    if (err) return res.cc(err)

    // 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc("分类名称与别名被占用，请更换后重试！")
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc("分类名称与别名被占用，请更换后重试！")
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc("分类名称被占用，请更换后重试！")
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc("分类别名被占用，请更换后重试！")

    const input_sql = "insert into ev_article_cate set?"
    db.query(input_sql, req.body, function (err, results) {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("新增文章分类失败")

      // 新增文章成功
      res.cc("新增文章分类成功！", 0)
    })
  })
}

// 删除文章分类
exports.deleteCateById = function (req, res) {
  // 定义删除文章分类的sql语句
  const sql = "update ev_article_cate set is_delete=1 where id = ?"
  db.query(sql, req.params.id, function (err, results) {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc("删除文章失败", 1)
    res.cc("删除文章成功", 0)
  })
}

// 根据 Id 获取文章分类数据
exports.getArtCateById = function (req, res) {
  const sql = "select *from ev_article_cate where id=?"
  db.query(sql, req.params.id, function (err, results) {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc("获取文章数据失败")
    res.send({
      status: 0,
      message: "获取文章成功",
      data: results[0]
    })
  })
}

// 根据 Id 更新文章分类数据
exports.updateCateById = function (req, res) {
  console.log("需要更新的数据", req)
  console.log("需要更新的数据", req.body)
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
  db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc("分类名称与别名被占用，请更换后重试！")
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc("分类名称与别名被占用，请更换后重试！")
    // 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc("分类名称被占用，请更换后重试！")
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc("分类别名被占用，请更换后重试！")

    // 定义更新文章分类的 SQL 语句：
    const sql = "update ev_article_cate set ? where id=?"
    db.query(sql, [req.body, req.body.Id], function (err, results) {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc("更新文章分类失败！")
      res.cc("更新文章成功", 0)
    })

    // db.query(sql, [req.body, req.body.Id], (err, results) => {
    //     // 执行 SQL 语句失败
    //     if (err) return res.cc(err)

    //     // SQL 语句执行成功，但是影响行数不等于 1
    //     if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

    //     // 更新文章分类成功
    //     res.cc('更新文章分类成功！', 0)
    //   })
  })
}

// 发布新文章
exports.addArticle = function (req, res) {
  // 使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据。
  // console.log(req.body)
  // console.log(req.file)
  // console.log(req.file.fieldname)
  // 验证文件是否为封面图片
  if (!req.file || req.file.fieldname !== "cover_img") return res.send("文章封面是必选的参数")
  const articleInfo = {
    ...req.body,
    cover_img: path.join("/upload", req.file.fieldname),
    pub_date: new Date(),
    author_id: req.user.id
  }
  // console.log(articleInfo)
  // 定义发布文章的 SQL 语句：

  const sql = "insert into ev_articles set?"
  db.query(sql, articleInfo, function (err, results) {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc("发布文章失败")
    res.cc("发布文章成功", 0)
  })
}
