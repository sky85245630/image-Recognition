var jwt = localStorage.getItem('token');
var innerTool_jwt = localStorage.getItem('innerTool_token');



var login = JSON.stringify({
    "username":"img_recognition",
    "password":"Ryndz@B3uP"
});

//確認登入狀態 30s更新一次 
// $.ajax({
//     url : "http://3.0.202.119:8080/api/v2/check_token_expired",
//     type: "GET",
//     headers:{
//         "Authorization" : "Bearer" + innerTool_jwt
//     },
//     error:function(xhr){
//         console.log("Johnny的check_token_expired取得失敗");
//         // window.location.href="login.html"
//     },
//     success:function(xhr){
//         console.log("check_token_expired成功")
//     }
// });

//圖像辨識token
$.ajax({
    url: "http://api.i-buzz.com.tw/img-recognition/login",
    type: "POST",
    data:login,
    // headers: {
    //     Authorization: "Bearer " + jwt
    // },
    contentType: "application/json; charset=utf-8",
    error: function(xhr) {
      alert("登入失敗");
      console.log(xhr);
    //   console.log(typeof(JSON.parse({
    //     "username":"img_recognition",
    //     "password":"Ryndz@B3uP"
    // })));
    },
    success: function(data) {
      console.log(data);
      console.log('登入成功');
    //   alert('OO');
      localStorage.setItem('token',data.access_token);
    //   window.location.href="index.html";
    }
  });

function lifestyle1(){
    //生活風格列表
    $.ajax({
      url:"http://api.i-buzz.com.tw/img-recognition/lifestyle_list",
      type:"GET",
      headers:{
          Authorization: "Bearer " + jwt
      },
      error:function(xhr){
        console.log("取得生活風格列表失敗");
        console.log(xhr)

      },
      success:function(data){
        console.log("取得生活風格列表成功");
        for ( i=0 ; i < data.lifestyle_list.length ; i++){
            QQ += '<option name="' + data.lifestyle_list[i] + '" value="' + data.lifestyle_list[i] + '">' + data.lifestyle_list[i] + '</option>'
        }
      }
    })
  return QQ
}

  //人物風格列表
  $.ajax({
    url:"http://api.i-buzz.com.tw/img-recognition/characterstyle_list",
    type:"GET",
    headers:{
        Authorization: "Bearer " + jwt
    },
    error:function(xhr){
      console.log("取得人物風格列表失敗");
      console.log(xhr)

    },
    success:function(data){
      console.log("取得人物風格列表成功");
      // console.log(data.character_style[1]);
      console.log(data.characterstyle_list)
      for ( i=0 ; i < data.characterstyle_list.length ; i++){
          character = '<option name="' + data.characterstyle_list[i] + '" value="' + data.characterstyle_list[i] + '">' + data.characterstyle_list[i] + '</option>'
          $('#character_style').append(character);
        //   console.log(data.character_style[i])
        //   console.log( character )
      }
    }
})


//顯示在畫面上

var local_character_start_date = localStorage.getItem('character_start_date')
var local_character_end_time = localStorage.getItem('character_end_time')
var local_modify_status = localStorage.getItem('modify_status') =="true"?true:false

var QQ = JSON.stringify({
  start_date: local_character_start_date,
  end_date: local_character_end_time,
  modify_status: local_modify_status,
  page_num: 1
});

var a = lifestyle1()
$.ajax({
  url: "http://api.i-buzz.com.tw/img-recognition/style_recongition",
  type: "POST",
  headers: {
    Authorization: "Bearer " + jwt
  },
  data: QQ,
  contentType: "application/json; charset=utf-8",
  error: function(xhr) {
    console.log("傳送人物校正時間區間失敗");
    console.log(xhr);
  },
  success: function(data) {
    
  //   //取得生活風格列表
  //   function lifestyle(){
  //     $.ajax({
  //       url:"http://api.i-buzz.com.tw/img-recognition/lifestyle_list",
  //       type:"GET",
  //       headers:{
  //           Authorization: "Bearer " + jwt
  //       },
  //       error:function(xhr){
  //         console.log("取得生活風格列表失敗");
  //         console.log(xhr)
  
  //       },
  //       success:function(data){
  //         console.log("取得生活風格列表成功");
  //         // console.log(data.lifestyle_list[1]);
  //         // console.log(data.lifestyle_list.length)
  //         for ( i=0 ; i < data.lifestyle_list.length ; i++){
  //             QQ = '<option name="' + data.lifestyle_list[i] + '" value="' + data.lifestyle_list[i] + '">' + data.lifestyle_list[i] + '</option>'
  //         }
  //       }
  //     })
  //   return QQ.toString()
  // }
    console.log("傳送人物校正時間區間成功");
    // console.log(data.character_style[1]);
    console.log(data);
    console.log(data.data[0].kol_id);
      for ( i=0 ; i < data.data.length ; i++){
          character = '<tr> <td>' + data.data[i].kol_id + '</td><td> <a href="'+ data.data[i].pic_url +'" data-toggle="lightbox"> <img src="'+ data.data[i].pic_url +'" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：'+ data.data[i].character +'<br/> 生活風格：'+ data.data[i].lifestyle +'<br/> 性別：'+ data.data[i].gender +'<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn"> <option selected disabled>'+ data.data[i].character +'</option> </select ><br/> <select id="life_style" class="btn btn-mini result_btn"> <option selected disabled>'+ data.data[i].lifestyle +'</option>'+ lifestyle1()+' </select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>'+ data.data[i].gender +'</option ><option name="男" value="男">男</option ><option name="女" value="女">女</option> </select ><br/> </td><td> <button type="button" class="btn btn-success">儲存</button> </td></tr>'
          $('#character').append(character);
        //   console.log(data.character_style[i])
        //   console.log( character )
      }
    // $('#set_character_data').modal('hide');
  }
});