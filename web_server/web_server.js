const express = require("express")
const { appendFile } = require("fs")

const server = express()

server.use(express.static("./src"))

server.get("/", function (req, res) {
  res.send("你好")
})

server.listen(8080, function () {
  console.log("WEB-Server is running at http://127.0.0.1:8080")
})
