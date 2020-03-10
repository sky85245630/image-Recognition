var jwt = localStorage.getItem('token');
var innerTool_jwt = localStorage.getItem('innerTool_token');


var login = {
    "username":"img_recognition",
    "password":"Ryndz@B3uP"
};

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
    data:JSON.stringify(login),
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
        // console.log(data.lifestyle_list[1]);
        // console.log(data.lifestyle_list.length)
        for ( i=0 ; i < data.lifestyle_list.length ; i++){
            QQ = '<option name="' + data.lifestyle_list[i] + '" value="' + data.lifestyle_list[i] + '">' + data.lifestyle_list[i] + '</option>'
            $('#life_style').append(QQ);
            // console.log(data.lifestyle_list[i])
            // console.log( QQ )
        }
      }
  })

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