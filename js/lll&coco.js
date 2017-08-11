let job_type = 'alltype';
let job_category = 'allcategory';
$(document).ready(function () {
    $('#type').on('click','.btn',function () {
        job_type = $(this).attr('id');
        flagOfType.forEach(function (key) {
            if(key.id === job_type)
            {
                changesingle(key);
                changeothers(key,flagOfType);
                if(key.flag === false){
                    job_type = 'alltype';
                }
            }
        });
        getJobFromChose(job_type,job_category);
    });
    $('#category').on('click','.btn',function () {
        job_category = $(this).attr('id');
        flagOfCategory.forEach(function (key) {
            if(key.id === job_category)
            {
                changesingle(key);
                changeothers(key,flagOfCategory);
                if(key.flag === false){
                    job_category = 'allcategory';
                }
            }
        });
        getJobFromChose(job_type,job_category);
    });
});
function changesingle(key) {
    if(key.flag===false){
        key.flag = true;
    }
    else {
        key.flag = false;
    }
}
function changeothers(key,arr) {
    arr.forEach(function (targ) {
        if(targ.id !== key.id){
            targ.flag = false;
        }
    });
}
function getJobFromChose(type,category) {
    $.get(`/alljobs/${type}/${category}`,function (job) {
        let str = '';
        for(let j = 0; j<job.length;j++){
            str += ` <div class="col-lg-4 col-sm-6 col-xs-12">
               <div class="post">
                   <a href=" "></a >
                   <h3>
                       <a href="post.html" class="Post-title">${job[j].position}</a >
                   </h3>
                   <ul class="list-inline">
                       <li>
                           <a href="#" class="releaseUser"><i class="fa fa-user"></i> ${job[j].user_id}</a >
                       </li>
                       <li>
                           <a href="#" class="tags"><i class="fa fa-tags"></i> ${job[j].category}</a >
                       </li>
                       <li>
                           <a href="#" class="date"><i class=" glyphicon glyphicon-time"></i> ${job[j].release_date}-${job[j].expiry_date}</a >
                       </li>
                   </ul>
                   <p class="description">
                       ${job[j].description}
                   </p >
                   <div class="text-left">
                       <a href="post.html" class="location"><i class="glyphicon glyphicon-map-marker"></i> ${job[j].country}${job[j].city}</a >
                   </div>
                   <div class="text-right">
                       <a href="post.html" class="btn btn-link">Continue...</a >
                   </div>
               </div>
           </div>`;
        }
        $('.jobs-box').html('');
        $('.jobs-box').append(str);
    });
}
//----------搜索----------
$(document).ready(function () {
    $('#search_btn').click(function(e){
        e.preventDefault();
        let search_val = $('#search_input').val();
        $.get(`/search/${search_val}`,function (job) {
            let str = '';
            for(let j = 0; j<job.length;j++){
                str += ` <div class="col-lg-4 col-sm-6 col-xs-12">
               <div class="post">
                   <a href=" "></a >
                   <h3>
                       <a href="post.html" class="Post-title">${job[j].position}</a >
                   </h3>
                   <ul class="list-inline">
                       <li>
                           <a href="#" class="releaseUser"><i class="fa fa-user"></i> ${job[j].user_id}</a >
                       </li>
                       <li>
                           <a href="#" class="tags"><i class="fa fa-tags"></i> ${job[j].category}</a >
                       </li>
                       <li>
                           <a href="#" class="date"><i class=" glyphicon glyphicon-time"></i> ${job[j].release_date}-${job[j].expiry_date}</a >
                       </li>
                   </ul>
                   <p class="description">
                       ${job[j].description}
                   </p >
                   <div class="text-left">
                       <a href="post.html" class="location"><i class="glyphicon glyphicon-map-marker"></i> ${job[j].country}${job[j].city}</a >
                   </div>
                   <div class="text-right">
                       <a href="post.html" class="btn btn-link">Continue...</a >
                   </div>
               </div>
           </div>`;
            }
            $('.jobs-box').html('');
            $('.jobs-box').append(str);
            $('html,body').animate({scrollTop: '680px'},200);
        });
    });
});

//----up to top----
$(window).scroll(function(){  //只要窗口滚动,就触发下面代码
    let scrollt = document.documentElement.scrollTop + document.body.scrollTop; //获取滚动后的高度
    if( scrollt >200 ){  //判断滚动后高度超过200px,就显示
        $("#toTop").fadeIn(400); //淡出
    }else{
        $("#toTop").stop().fadeOut(400); //如果返回或者没有超过,就淡入.必须加上stop()停止之前动画,否则会出现闪动
    }
});
$("#toTop").click(function(){ //当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部
    $("html,body").animate({scrollTop:"0px"},400);
});