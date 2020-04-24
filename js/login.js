

$(document).ready(function () {
  var jwt = localStorage.getItem('token');
  var innerTool_token = localStorage.getItem('innerTool_token');
  var innerTool_jwt = localStorage.getItem('innerTool_token');
  var ip = "http://api.i-buzz-system.com";


  var login = JSON.stringify({
    "username": "img_recognition",
    "password": "Ryndz@B3uP"
  });


  //圖像辨識token
  $.ajax({
    url: ip + "/img-recognition/login",
    type: "POST",
    data: login,
    async: false,
    // headers: {
    //     Authorization: "Bearer " + jwt
    // },
    contentType: "application/json; charset=utf-8",
    error: function (xhr) {
      alert("登入失敗");
      console.log(xhr);
      window.location.href = "login.html";
      //   console.log(typeof(JSON.parse({
      //     "username":"img_recognition",
      //     "password":"Ryndz@B3uP"
      // })));
    },
    success: function (data) {
      console.log(data);
      console.log('登入成功');
      //   alert('OO');
      localStorage.setItem('token', data.access_token);

      //   window.location.href="index.html";
    }
  });

//內部工具 check_token_expired
  $.ajax({
    url: "http://3.0.202.119:8080/api/v2/check_token_expired",
    type: "GET",
    headers: {
      "Authorization": 'Bearer ' + innerTool_token
    },
    error: function (xhr) {
      console.log("登入失敗，請重新登入");

      console.log(xhr)
      window.location.href = "login.html";

    },
    success: function (xhr) {
      console.log("登入成功");
    }
  });




})