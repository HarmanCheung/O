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
            company:String,
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
            user_id:Number
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

// --------2 根据工作职位过滤职位-------
app.get('/position/:position',function (req,res) {
    let position=req.params.position;//positon: name of selected position
    req.models.job.find({position:position} ,function (err,jobs) {
        console.log(jobs);
        res.send(jobs);
    });
});
// --------2 根据工作职位过滤职位-------

//-------3 根据工作性质过滤职位------
app.get('/type/:type',function (req,res) {
    let type=req.params.type;
    req.models.job.find({type:type} ,function (err,jobs) {
        console.log(jobs);
        res.send(jobs);
    });
});
//-------3 根据工作性质过滤职位------

//------根据工作的标题、公司名字和职位描述进行模糊搜索------
app.get('/search/:search',function (req,res) {
    let search=req.params.search;
    req.models.job.find({
        position:`%${search}%`,
        company:`%${search}%`,
        description:`%${search}%`
    } ,function (err,jobs) {
        console.log(jobs);
        res.send(jobs);
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
function checkEmail(str){
    let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
app.get('/signup',function (req,res) {
    let email=req.body.email,
        password=req.body.password,
        confirmation=req.body.confirmation;
    let newRecord={
        email:email,
        password:password,
    };
    req.models.user.find({email:email},function (err,user) {
        if (err){
            if (checkEmail(email)){
                if (password===confirmation){
                    res.send(newRecord);
                    // 注册信息填写正确，则跳转至首页，需要用户去邮箱里点击验证链接来登录到该网站。
                }else {
                    res.send('pwd not same');//pwd not same
                }
            }else {
                res.send('email not correct');//email not correct
            }
        }else {
            res.send('user already existed')//already existed email
        }
    });
});

app.post('/:email/:password',function (req,res) {
    let email=req.params.email,
        password=req.params.password;
    let newRecord={
        email:email,
        password:password,
        company:'',
        address:'',
        field:''
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
app.get('/forget',function (req,res) {
    let email=req.body.email;
    req.models.user.find({email:email} ,function (err,email) {
        if (err){
            console.log(err);
        }else {
            res.send(email)
        }
    });
});
//----12 忘记密码,发送重置密码的邮件----

//----12 用户get邮件，并跳转到登录页面,change pwd---
app.put('/forget/signin/:email',function (req,res) {
    let email=req.params.email,
        password=req.body.password,
        confirmation=req.body.confirmation;
    if (password===confirmation){
        req.models.user.find({email:email},function (err,userinfo) {
            let user=userinfo[0];
            user.password=password;
            user.save(function (err) {
                if (err) {
                    console.log('err' + err);
                }else {
                    res.send(true)//new pwd saved
                }
            })
        })
    }
});
//----12 用户get邮件，并跳转到登录页面,change pwd---

app.listen(3000,()=>{
   console.log('Express is listening to 3000...')
});