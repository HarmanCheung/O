//-----展示所有职位列表------
function start() {
    $.get('/alljobs',function (ans) {
        let job = ans;
        // console.log(job);
        let str = '';
        for(let j = 0; j<job.length;j++){
            str += ` <div class="col-lg-4 col-sm-6 col-xs-12">
                   <div class="post">
                       <a href="post.html"></a>
                       <h3>
                           <a href="post.html" class="Post-title">${job[j].position}</a>
                       </h3>
                       <ul class="list-inline">
                           <li>
                               <a href="#" class="releaseUser"><i class="fa fa-user"></i> ${job[j].user_id}</a>
                           </li>
                           <li>
                               <a href="#" class="tags"><i class="fa fa-tags"></i> ${job[j].category}</a>
                           </li>
                           <li>
                               <a href="#" class="date"><i class="	glyphicon glyphicon-time"></i> ${job[j].release_date}-${job[j].expiry_date}</a>
                           </li>
                       </ul>
                       <p class="description">
                           ${job[j].description}
                       </p>
                       <div class="text-left">
                           <a href="post.html" class="location"><i class="glyphicon glyphicon-map-marker"></i> ${job[j].country}${job[j].city}</a>
                       </div>
                       <div class="text-right">
                           <a href="post.html" class="btn btn-link">Continue...</a>
                       </div>
                   </div>
               </div>`;
        }
        $('.jobs-box').append(str);
    });
}
// $(start());
$(document).ready(function () {
    $('.jobs-box').empty();
    start();
    getTypeAndCategory();
});

//---------动态添加type and category-----------
let flagOfType;
let flagOfCategory;

function getTypeAndCategory() {
    // let categories = [];

    $.get('/alljobs/type',function (ans) {
        let str = ``;
        flagOfType = [];
        for(let i = 0;i<ans.length;i++){
            str += `<button type="button" class="btn btn-default " id="${ans[i]}">${ans[i]}</button>`;
            let flag =  {flag:false,id:`${ans[i]}`};
            flagOfType.push(flag);
        }
        $('#type').append(str);
    });
    $.get('/alljobs/category',function (ans) {
        let str = ``;
        flagOfCategory = [];
        for(let i = 0;i<ans.length;i++){
            str += `<button type="button" class="btn btn-default " id="${ans[i]}">${ans[i]}</button>`;
            let flag =  {flag:false,id:`${ans[i]}`};
            flagOfCategory.push(flag);
        }
        $('#category').append(str);
    });
    // console.log(types);


}



