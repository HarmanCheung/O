/**
 * Created by zhm & hl on 17-8-8.
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
            user_id:Number,
            is_showing:Boolean
        });
        next();
    }
}));


// -------1 显示所有职位--------
app.get('/alljobs',function (req,res) {
    req.models.job.find({} ,function (err,job) {
        console.log(job);
        res.send(job);
    });
});
// -------1 显示所有职位--------res : [{str},{str}]

// -------1.1 所有工作职位--------
app.get('/alljobs/type',function (req,res) {
    req.models.job.find({},function (err,jobs) {
        let arr=[];
        for (let i=0;i<jobs.length;i++){
            arr.push(jobs[i].type)
        }
        res.send(arr);
    })
});
/**["Development",
 "Designer",
 "Designer",
 "Marketing",
 "Development",
 "Designer",
 "Product manager",
 "Product manager"
 ]**/
// -------1.2 所有工作性质--------
app.get('/alljobs/category',function (req,res) {
    req.models.job.find({},function (err,jobs) {
        let arr=[];
        for (let i=0;i<jobs.length;i++){
            arr.push(jobs[i].category)
        }
        res.send(arr);
    })
});


// --------2 根据工作职位过滤职位-------
//-------3 根据工作性质过滤职位------
//-------------project 2 and 3---------------
app.get('/alljobs/:type/:category',function (req,res) {
    let type = req.params.type;
    let category = req.params.category;
    if(type === 'alltype'){
        if(category === 'allcategory'){
            req.models.job.find({},function (err,allJobs) {
                res.send(allJobs);
            });
        }
        else{
            req.models.job.find({category:category},function (err,justFromCategory) {
                res.send(justFromCategory);
            });
        }
    }
    else{
        if(category === 'allcategory'){
            req.models.job.find({type:type},function (err,justFromType) {
                res.send(justFromType);
            });
        }
        else{
            req.models.job.find({type:type,category:category},function (err,fromTypeAndCateGory){
                res.send(fromTypeAndCateGory);
            });
        }
    }
});
//------根据工作的标题(position)、公司名字(company)和职位描述(description)进行模糊搜索------

function xunhuan(resultarr,findarr) {
    let id = [];
    resultarr.forEach(function (key) {
        id.push(key.id);
    });
    for (let i=0;i<findarr.length;i++){
        if (id.indexOf(findarr[i].id)<0){
            resultarr.push(findarr[i]);
        }
    }
}

app.get('/:search',function (req,res) {
    let search=req.params.search;
    let resultarr=[];
    req.models.job.find({position:orm.like(`%${search}%`)},function (err,nearposition) {
        xunhuan(resultarr,nearposition);
        req.models.job.find({description:orm.like(`%${search}%`)},function (err,neardescription) {
            xunhuan(resultarr,neardescription);
            req.models.job.find({category:orm.like(`%${search}%`)},function (err,nearcategory) {
                xunhuan(resultarr,nearcategory);
                // res.send(resultarr);
                req.models.job.find({type:orm.like(`%${search}%`)},function (err,neartype) {
                    xunhuan(resultarr,neartype);
                    req.models.job.find({country:orm.like(`%${search}%`)},function (err,nearcountry) {
                        xunhuan(resultarr,nearcountry);
                        req.models.job.find({city:orm.like(`%${search}%`)},function (err,nearcity) {
                            xunhuan(resultarr,nearcity);
                            res.send(resultarr);
                        })
                    })
                })
            });
        });

    });
});
//------根据工作的标题、公司名字和职位描述进行模糊搜索------

//------5 查看职位详情-----
app.get('/alljobs/:id',function (req,res) {
    let id=req.params.id;
    req.models.job.find({id:id} ,function (err,job) {
        console.log(job);
        res.send(job);
    });
});
//------5 查看职位详情-----



//功能6：发布一个职位
app.post('/postOneJob',function (req,res) {
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
app.get('/checkJobList',function (req,res) {
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
app.get('/checkJob',function (req,res) {
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
app.get('/checkUserInfo',function (req,res) {
    req.models.user.find({id:req.body.id},function (err,userInfo) {
        res.send(userInfo);
    });
});
//显示用户信息

//接受新信息，修改数据库
app.post('/reviseUserInfo',function (req,res) {
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
app.post('/logIn',function (req,res) {
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


//----11 点击注册按钮，就会验证该注册信息是否正确-----
app.get('/signup/:email',function (req,res) {
    let email=req.params.email;
    req.models.user.find({email:email},function (err,user) {
        if (err){
            res.send(email);
            // 注册信息填写正确(no such email in database)，则跳转至首页，需要用户去邮箱里点击验证链接来登录到该网站。
        }else {
            res.send('existed')//already existed user email
        }
    });
});

app.post('/user',function (req,res) {
    let data = req.body;
    let newRecord={
        email:data.email,
        password:data.password,
        company:'',
        address:'',
        field:'',
        name:data.name
    };
    if(req.models.user.find())
        req.models.user.create(newRecord,function (err,rep) {
            if (err){
                console.log(err);
                res.send("sign up failed!");
            }else {
                res.send(JSON.stringify(rep));
            }
        })
});
//----11 点击注册按钮，就会验证该注册信息是否正确-----

//----12 忘记密码,发送重置密码的邮件----
app.get('/forget/:email',function (req,res) {
    let email=req.params.email;
    req.models.user.find({email:email} ,function (err,email) {
        if (err){
            res.send('no such user')
        }else {
            res.send(email)
        }
    });
});
// //----12 忘记密码,发送重置密码的邮件----
//
// //----12 用户get邮件，并verify---
app.put('/put',function (req,res) {
    let email = req.body.email;
    req.models.user.find({email: email}, function (err, user) {//change pwd and save
        user[0].password = req.body.password;
        user[0].confirmation = req.body.confirmation;
        user[0].save(function (err) {
            if (err) {
                console.log('err' + err);
            } else {
                res.send(user);
            }
        })
    })
});
//----12 用户get邮件，并跳转到登录页面,change pwd---


var server = app.listen(1997,function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("访问地址为 http://%s:%s", host, port);
});