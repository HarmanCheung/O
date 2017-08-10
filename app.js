/**
 * Created by zhm on 17-8-8.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let orm = require('orm');
/*let opts = {
    database: "test_db",
    protocol: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "root",
    query: {
        pool: true,
    },
};*/
orm.connect('sqlite:/home/zhm/O/jobs.db', function(err, db) {
    if (err) {
        return console.error('Connection error: ' + err);
    }
        else {
        console.log('success!');
    }
});

app.use(orm.express("sqlite:/home/zhm/O/jobs.db", {
    define: function (db, models, next) {
        models.user = db.define("user",{
            id:Number,
            email:String,
            password:String,
            company:String,
            address:String,
            field:String
        });
        models.job = db.define("job", {

            position:String,
            company:String,
            description:String,
            tags:String,
            expiry_date:String,
            category:String,
            type:String,
            country:String,
            city:String,
            release_date:String,
            is_paid:Boolean,
            user_id:Number
        });
        next();
    }
}));


//功能6：发布一个职位
app.post('/6',function (req,res) {
    let newJob = { position: req.body.position, company:req.body.company, description:req.body.description, tags:req.body.tags, apply:req.body.apply, expiry_date:req.body.expiry_date, category:req.body.category,type:req.body.type, country:req.body.country, city:req.body.city, release_date:req.body.release_date, is_paid:req.body.is_paid, user_id:req.body.user_id};

    console.log(req.body);
       req.models.job.create(newJob, function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.send('Job: ' + req.body.position + ' from ' + req.body.company + ' has been published');
            }
        });
});
//功能6：发布一个职位

//功能7：用户查看自己创建的职位Post列表
app.get('/7',function (req,res) {
    req.models.job.find({user_id:req.body.user_id},function (err,jobsInfo) {
        if (err){
            console.log(err);
        }
        else{
            res.send(jobsInfo);
        }
    });
});
//功能7：用户查看自己创建的职位Post列表

//功能8：用户查看自己创建的职位Post详情
app.get('/8',function (req,res) {
    req.models.job.find({id:req.body.id},function (err,jobInfo) {
        if (err){
            console.log(err);
        }
        else {
            res.send(jobInfo);
        }
    });
});
//功能8：用户查看自己创建的职位Post详情

//功能9：修改账户信息

//显示用户信息
app.get('/9',function (req,res) {
    req.models.user.find({id:req.body.id},function (err,userInfo) {
        res.send(userInfo);
    });
});
//显示用户信息

//接受新信息，修改数据库
app.post('/9/1',function (req,res) {
    req.models.user.find({id:req.body.id},function (err,userInfo) {
        if (err){
            console.log(err);
        }
        else {
            userInfo[0].email = req.body.email;
            userInfo[0].password = req.body.password;
            userInfo[0].company = req.body.company;
            userInfo[0].address = req.body.address;
            userInfo[0].field = req.body.field;
            userInfo[0].save(function (err) {
                if (err){
                    console.log(err);
                }
                else {
                    res.send('信息修改成功！');
                }
            });
        }
    });
});
//接受新信息，修改数据库

//功能9：修改账户信息

//功能10：登录
app.post('/10',function (req,res) {
    req.models.user.find({email:req.body.email},function (err,userPassword) {
        if (err){
            console.log(err);
        }
        else {
            if(req.body.password === userPassword[0].password){
                res.send('登录成功');
            }
            else{
                res.send('邮箱或密码输入错误');
            }
        }
    });
});
//功能10：登录

var server = app.listen(1997,function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("访问地址为 http://%s:%s", host, port);
});