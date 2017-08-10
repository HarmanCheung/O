function
checkEmail(str){
    var
        re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if(re.test(str)){
        console.log("正确");
    }else{
        console.log("错误");
    }
}
checkEmail("contact@cnblogs.ceteeee");