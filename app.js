const express=require("express");
const app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//------send html-------
// app.use(express.static(__dirname+'/public'));
// app.get('/', (req, res) => {
//     res.sendFile('index.html', {root: './public'});
// });
//------send html-------

//-------connect to db-------
let orm = require("orm");
orm.connect('sqlite:/home/huadu/workspace/O/jobs.db', function(err, db) {
    if (err) return console.error('Connection error: ' + err);
    console.log('good');
});

app.use(orm.express('sqlite:/home/huadu/workspace/O/jobs.db',{
    define: function (db, models, next) {
        models.job = db.define("job", {
            id:Number,
            position:String,
            description:String,
            tags:String,
            apply:String,
            expiry_date:String,
            category:String,
            type:String,
            country:String,
            city:String,
            release_date:String,
            is_paid:String,
            user_id:Number,
            is_showing:String
        });
        next();
    }
}));
//-------connect to db-------

// -------1 显示所有职位--------
app.get('/alljobs',function (req,res) {
    req.models.job.find({} ,function (err,job) {
        console.log(job);
        res.send(job);
    });
});
// -------1 显示所有职位--------res : [{str},{str}]

// --------2 根据工作职位过滤职位-----//e.g. product manager/designer/..
app.get('/type/:type',function (req,res) {
    let type=req.params.type;
    req.models.job.find({type:type} ,function (err,jobs) {
        console.log(jobs);
        res.send(jobs);
    });
});
// --------2 根据工作职位过滤职位-------

//-------3 根据工作性质过滤职位------//e.g. volunteer/contract/..
app.get('/category/:category',function (req,res) {
    let category=req.params.category;//category: name of selected category
    req.models.job.find({category:category} ,function (err,jobs) {
        console.log(jobs);
        res.send(jobs);
    });
});
//-------3 根据工作性质过滤职位------

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
    let email=req.body.email,
        password=req.body.password,
        name=req.body.name;
    let newRecord={
        email:email,
        password:password,
        company:'',
        address:'',
        field:'',
        name:name
    };
    req.models.user.create(newRecord,function (err,user) {
        if (err){
            res.send('sign up failed')
        }else {
            res.send(user)
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

app.listen(3000,()=>{
   console.log('Express is listening to 3000...')
});