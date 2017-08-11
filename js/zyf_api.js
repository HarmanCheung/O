const express=require("express");
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
let orm = require("orm");
const nodemailer = require('nodemailer');

orm.connect('sqlite:/home/zuoyoufei/下载/list/jobs.db', function(err, db) {
    if (err) return console.error('Connection error: ' + err);
    // console.log('good');
});

app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '2017983051@qq.com',
        pass: 'etcozdixiiqrejaf'
    }
});
// setup email data with unicode symbols
app.use(orm.express('sqlite:/home/zuoyoufei/下载/list/jobs.db',{
    define: function (db, models, next) {
        models.user= db.define("user", {
            id:Number,
            email:String,
            password:String,
            company:String,
            address:String,
            field:String,
            // name:String
        });
        next();
    }
}));

app.post('/user',function (req,res) {
    let data = req.body;
    let newRecord={
        email:data.email,
        password:data.password,
        company:'',
        address:'',
        field:'',
        // name:data.name
    };
    req.models.user.exists({email:data.email},function (err,reply) {
        if(reply===true){
            //alert("This account has been registered!");
            // console.log(err);
            res.send("This account has been registered!");
            console.log("This account has been registered!");
        }
        else{
            req.models.user.create(newRecord,function (err,rep) {
                if (err){
                    console.log(err);
                    res.send("sign up failed!");
                }else {
                    res.send(JSON.stringify(rep));
                }
            });
        }
    });
});
app.post('/sendMail',function (req,res) {
    let data=req.body;
    console.log(data);
    let mailOptions = {
        from: '"Only"<2017983051@qq.com>', // sender address
        to: `${data.email}`, // list of receivers 1844678323@qq.com
        subject: 'Welcome to Coding Girls Club(CGC)', // Subject line
        text: `Thank you for paying attention to CGC's jobs part.
            Please attach the verification code to check your identification,
            verification code:${data.verificationCode}.
            Any question, please contact with us.`, // plain text body
    };
    // console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        // console.log("begin");
        if (error) {
            // console.log("error");
            return  console.log(error);
        }
        else{
            console.log("success!");
        }
    });
    res.send("success!");
});
app.listen(3000, () => {
    console.log('running on port 3000...');
});

