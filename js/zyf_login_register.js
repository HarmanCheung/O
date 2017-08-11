 // const nodemailer = require('nodemailer');
 var mailBox=$('#register-email');
 var userInputVerificationCode=$('#verification_code');
 var password=$('#register-password');
 var confirmPass=$('#password_confirmation');

 let info={password:{},email:{},verificationCode:{}};

 function getRandomCode() {
     let result="";
     for(let i=0;i<6;i++) {
         result+= Math.floor(Math.random() * 10).toString();
     }
     return result;
 }
 let verificationCode=getRandomCode();

 info.password=password;
 info.email=mailBox;
 info.verificationCode=verificationCode;

$(document).ready(function () {
    $("#getCode").click(function (e) {
        $.post('http://localhost:3000/sendMail',info,function (ans) {
           console.log(ans);
        });
    });
});
 $(document).ready(function () {
     $('#btn-register').click(function (e) {
         console.log("register!");
         e.preventDefault();
         if(confirmPass!==password){
             alert("Two times input password inconsistent!");
         }
         else if(userInputVerificationCode!==verificationCode){
                 alert("Verification code error！");
         }
         else{
             $.post('http://localhost:3000/user',info,function (ans) {
                 console.log(ans);
             });
         }
     });
 });

// 690862036@qq.com
