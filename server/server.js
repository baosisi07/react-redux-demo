const express = require("express");
const mongoose = require("mongoose");
//连接mongo 并且使用bss这个集合
const DB_URL = "mongodb://localhost:27017/bss";
mongoose.connect(DB_URL);
mongoose.connection.on("connected", function() {
    console.log("mongodb has connected");
});

//类似mysql表 mongo里有文档、字段概念
const User = mongoose.model("user", new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    }
}))

// User.create({
//     user: "小明",
//     age: 27
// }, function(err, doc) {
//     if (!err) {
//         console.log(doc);
//     } else {
//         console.log(err);
//     }
// })

// User.update({
//     "user": "小蚊子"
// }, {
//     "$set": {
//         age: 18
//     }
// }, function(err, doc) {
//     console.log(doc);
// })
//新建app
const app = express();

app.get("", function(req, res) {
    res.send("<h1>您好！</h1>");
})
app.get("/data", function(req, res) {
    User.findOne({
        "user": "小蚊子"
    }, function(err, doc) {
        res.json(doc);
    })
})

//安装nodemon 可以监听路由和响应内容，自动重启node服务
//然后nodemon server启动服务
app.listen(9093, function() {
    console.log("node app start at port 9093");
})