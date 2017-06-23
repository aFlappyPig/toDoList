/**
 * Created by jiannan.niu on 2017/6/22.
 */

//加载express主模块
var express = require('express');
//加载path工具模块，处理各种路径，node核心模块，自带
var path = require('path');
//生成express实例
var app = express();
//工具模块，解析req body
var bodyParser = require('body-parser');
//获取到mongo client
var MongoClient = require('mongodb').MongoClient;
//指定数据库地址
var url = 'mongodb://localhost:27017/test';
//指定端口
var port = process.env.PORT || 3000;

//express服务器全局设定
app.use(express.static(__dirname));
app.use(bodyParser.json());

//html文件路由，请求哪个文件就返回哪个文件
app.get('/*.html', function (req, res) {
    res.sendFile('*.html');
});

//保存数据接口
app.post('/save', function (req, res) {
    let data = req.body;

    //链接到mongodb
    MongoClient.connect(url, function (err, db) {
        //获取collection，相当于mysql中的table
        var test = db.collection('test');
        //查询并更新数据
        test.findAndModify({name: 'list'}, [], {$set: data}, {}, function (err, item) {
                if (err) {
                    console.log('mongo error when save')
                }
                //确认无错误，返回响应
                res.end('success');
            }
        );
        //数据库关闭
        db.close();
    });
});

app.get('/find', function (req, res) {

    MongoClient.connect(url, function (err, db) {

        var test = db.collection('test');
        //查询数据
        test.findOne({name: 'list'}, {}, function (err, doc) {
            if (err) {
                console.log('mongo error when find');
            }
            //确认无错误，返回请求数据
            res.send(doc.data);
        });
        db.close();
    });
});

//当用户请求的资源不存在时（浏览器地址栏随便输）重定向
app.get('/*', function (req, res) {
    res.redirect('/index.html');
});

//express服务器监听固定端口
app.listen(port, function () {
    console.log('正在监听3000端口');
});