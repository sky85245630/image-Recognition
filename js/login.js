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


$(document).ready(function () {
  var jwt = localStorage.getItem('token');
  var innerTool_token = localStorage.getItem('innerTool_token');
  var innerTool_jwt = localStorage.getItem('innerTool_token');

  var local_character_start_date = localStorage.getItem('character_start_date')
  var local_character_end_time = localStorage.getItem('character_end_time')
  var local_brand_start_date = localStorage.getItem('brand_start_date')
  var local_brand_end_time = localStorage.getItem('brand_end_date')
  var local_brand_modify_status = localStorage.getItem('brand_modify_status') == "true" ? true : false
  var local_modify_status = localStorage.getItem('modify_status') == "true" ? true : false
  var local_color_start_date = localStorage.getItem('color_start_date')
  var local_color_end_time = localStorage.getItem('color_end_time')
  var local_color_modify_status = localStorage.getItem('color_modify_status') == "true" ? true : false
  var ip = "http://api.i-buzz-system.com";
  var LS = life_style();
  var CS = character_style();


  var login = JSON.stringify({
    "username": "img_recognition",
    "password": "Ryndz@B3uP"
  });

  // $('#characterStartTime').append(local_character_start_date);
  // $('#characterEndTime').append(local_character_end_time);
  $('#characterTime').append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)
  $('#colorTime').append('時間區間：' + local_color_start_date + ' ~ ' + local_color_end_time)
  $('#brandTime').append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)



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







  //生活風格列表
  function life_style() {
    $.ajax({
      url: "http://api.i-buzz-system.com/img-recognition/lifestyle_list",
      type: "GET",
      headers: {
        Authorization: "Bearer " + jwt
      },
      // cache: false,
      async: true,

      error: function (xhr) {
        console.log("取得生活風格列表失敗");
        console.log(xhr)
        window.location.reload();

      },
      success: function (data) {
        console.log("取得生活風格列表成功");
        for (i = 0; i < data.lifestyle_list.length; i++) {
          LS += '<option name="' + data.lifestyle_list[i] + '" value="' + data.lifestyle_list[i] + '">' + data.lifestyle_list[i] + '</option>'
        }
        return LS;

      }
    })

  }


  //人物風格列表
  function character_style() {
    $.ajax({
      url: "http://api.i-buzz-system.com/img-recognition/characterstyle_list",
      type: "GET",
      headers: {
        Authorization: "Bearer " + jwt
      },
      async: true,

      // cache: false,
      error: function (xhr) {
        console.log("取得人物風格列表失敗");
        console.log(xhr)
        window.location.reload();

      },
      success: function (data) {
        console.log("取得人物風格列表成功");
        console.log(data.characterstyle_list)
        for (i = 0; i < data.characterstyle_list.length; i++) {
          CS += '<option name="' + data.characterstyle_list[i] + '" value="' + data.characterstyle_list[i] + '">' + data.characterstyle_list[i] + '</option>';

          //   console.log(data.character_style[i])
          //   console.log( character )
        }
        return CS;

      }

    })

  }

























































  //拉出local Storage資料顯示在畫面上CHARACTER

  var storage = JSON.stringify({
    start_date: local_character_start_date,
    end_date: local_character_end_time,
    modify_status: local_modify_status,
    page_num: 1
  });

  $.ajax({
    url: ip + "/img-recognition/style_recongition",
    type: "POST",
    headers: {
      Authorization: "Bearer " + jwt
    },
    data: storage,
    contentType: "application/json; charset=utf-8",
    error: function (xhr) {
      console.log("CHARACTER Local Storage尚無資料");
      console.log(xhr);
      // window.location.reload();
    },
    success: function (data) {

      console.log("CHARACTERs Local Storage取得成功");
      // console.log(data.character_style[1]);
      console.log(data);
      total = '<p >共 5 / ' + data.count + '</p>';
      console.log(total);
      $('.total').append(total);

      for (i = 0; i < data.data.length; i++) {
        character =
          "<tr> <td>" +
          data.data[i].kol_name +
          '</td><td> <a href="' +
          data.data[i].pic_url +
          '" data-toggle="lightbox"> <img src="' +
          data.data[i].pic_url +
          '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
          data.data[i].character +
          "<br/> 生活風格：" +
          data.data[i].lifestyle +
          "<br/> 性別：" +
          data.data[i].gender +
          '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn"> <option selected disabled>' +
          data.data[i].character +
          '</option>' + CS + ' </select ><br/> <select id="life_style" class="btn btn-mini result_btn"> <option selected disabled>' +
          data.data[i].lifestyle +
          "</option>" +
          LS +
          ' </select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
          data.data[i].gender +
          '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success">儲存</button> </td></tr>';



        $("#character").append(character);
        //   console.log(data.character_style[i])
        //   console.log( character )


      }
      $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)


      $(".btn-success").click(function () {

        var send_character_style = $(this).parent().parent().find('#character_style option:selected').val();
        var send_life_style = $(this).parent().parent().find('#life_style option:selected').val();
        var send_character_gender = $(this).parent().parent().find('#character_gender option:selected').val();
        var pic_id = $(this).parent().parent().find('#pic_id').val();
        var modify_person = localStorage.getItem('userName');

        console.log(send_character_style, send_life_style, send_character_gender, pic_id, modify_person);
        var data = JSON.stringify({
          imageid: pic_id,
          life_style: send_life_style,
          character_style: send_character_style,
          gender: send_character_gender,
          modify_person: modify_person
        })
        console.log(data);
        $.ajax({
          url: ip + "/img-recognition/style_modify",
          type: "POST",
          headers: {
            Authorization: "Bearer " + jwt
          },
          data: data,
          contentType: "application/json; charset=utf-8",
          error: function (xhr) {
            console.log("傳送風格辨識結果失敗");
            console.log(xhr);
          },
          success: function (data) {
            console.log("傳送風格辨識結果成功");
            // console.log(data.character_style[1]);
            console.log(data);
            alert('修改成功')
          }
        });

      });

      // $('#set_character_data').modal('hide');
    }
  });

  //結束拉出local Storage資料顯示在畫面上CHARACTER




  //拉出local Storage資料顯示在畫面上BRAND
  var brand_local_storage = JSON.stringify({
    start_date: local_brand_start_date,
    end_date: local_brand_end_time,
    modify_status: local_brand_modify_status,
    page_num: 1
  });

  $.ajax({
    url: ip + "/img-recognition/brand_recongition",
    type: "POST",
    headers: {
      Authorization: "Bearer " + jwt
    },
    data: brand_local_storage,
    contentType: "application/json; charset=utf-8",
    error: function (xhr) {
      console.log("BRAND Local Storage尚無資料");

      console.log(xhr);
      console.log(brand_local_storage)
      // window.location.reload();

    },
    success: function (data) {
      console.log("BRAND Local Storage取得資料成功");
      brand_total = '<p >共 5 / ' + data.count + '</p>';
      // console.log(total);
      // localStorage.setItem("brand_start_date", brand_start_date);
      // localStorage.setItem("brand_end_date", brand_end_date);
      // localStorage.setItem("brand_modify_status", brand_modify_status);
      // console.log(data.character_style[1]);
      console.log(data);
      // console.log(data.data[0].kol_id);
      $("#brand").empty();
      $(".brand_total").empty();
      $('.brand_total').append(brand_total);

      for (i = 0; i < data.data.length; i++) {
        brand =
          "<tr> <td>" +
          data.data[i].kol_name +
          '</td><td> <a href="' +
          data.data[i].pic_url +
          '" data-toggle="lightbox"> <img src="' +
          data.data[i].pic_url +
          '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ' + data.data[i].brand + ' </td><td> 辨識結果QQ </td><td> <button id="brand_save" type="button" class="btn btn-success">儲存</button> </td></tr>';

        $("#brand").append(brand);
      }
      $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)
      // $("#set_brand_data").modal("toggle");
      // window.location.reload();

      // $('#set_character_data').modal('hide');
    }
  });

  //end拉出local Storage資料顯示在畫面上BRAND




  // //拉出local Storage資料顯示在畫面上COLOR

  // var color_storage = JSON.stringify({
  //   start_date: local_color_start_date,
  //   end_date: local_color_end_time,
  //   modify_status: local_color_modify_status,
  //   page_num: 1
  // });

  // $.ajax({
  //   url: "http://api.i-buzz.com.tw/img-recognition/color_recongition",
  //   type: "POST",
  //   headers: {
  //     Authorization: "Bearer " + jwt
  //   },
  //   data: color_storage,
  //   contentType: "application/json; charset=utf-8",
  //   error: function (xhr) {
  //     console.log("傳送人物校正時間區間失敗");
  //     console.log(xhr);
  //   },
  //   success: function (data) {

  //     console.log("傳送人物校正時間區間成功");
  //     // console.log(data.character_style[1]);
  //     console.log(data);
  //     console.log(data.data[0].kol_id);
  //     for ( i=0 ; i < data.data.length ; i++){
  //       color = ' <tr> <th scope="row">'+ data.data[i].kol_id +'</th> <td> <a href="' + data.data[i].pic_url + '" data-toggle="lightbox"> <img src="' + data.data[i].pic_url + '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ?????? </td><td> ' + data.data[i].color[0].RGB + '</td><td> <select class="btn btn-mini result_btn"> <option selected disabled>照片風格</option> <option>正確</option> <option>待修正</option> </select> </td><td> <button type="button" class="btn btn-success">儲存</button> </td></tr>'
  //       $('#color').append(color);
  //     //   console.log(data.character_style[i])
  //     //   console.log( character )
  //   }
  // $('#set_color_data').modal('hide');
  //       //   console.log(data.character_style[i])
  //       //   console.log( character )

  //     // $('#set_character_data').modal('hide');
  //   }
  // });

  // //結束拉出local Storage資料顯示在畫面上COLOR




  //設定人物校正時間區間
  $("#character_search").click(function () {
    var character_start_date = $("#character_start_date").val();
    var character_end_time = $("#character_end_time").val();
    var modify_status =
      $('input[name="modify_status"]:checked').val() == "true" ?
      true :
      false;
    var page_num = 1;

    var storage = JSON.stringify({
      start_date: character_start_date,
      end_date: character_end_time,
      modify_status: modify_status,
      page_num: 1
    });

    $.ajax({
      url: ip + "/img-recognition/style_recongition",
      type: "POST",
      headers: {
        Authorization: "Bearer " + jwt
      },
      data: storage,
      contentType: "application/json; charset=utf-8",
      error: function (xhr) {
        console.log("傳送人物校正時間區間失敗");

        console.log(xhr);
        console.log(storage)
        window.location.reload();

      },
      success: function (data) {
        console.log("傳送人物校正時間區間成功OOOOO");
        total = '<p >共 5 / ' + data.count + '</p>';
        console.log(total);
        localStorage.setItem("character_start_date", character_start_date);
        localStorage.setItem("character_end_time", character_end_time);
        localStorage.setItem("modify_status", modify_status);
        // console.log(data.character_style[1]);
        console.log(data);
        // console.log(data.data[0].kol_id);
        $("#character").empty();
        $(".total").empty();
        $('.total').append(total);

        for (i = 0; i < data.data.length; i++) {
          character =
            "<tr> <td>" +
            data.data[i].kol_name +
            '</td><td> <a href="' +
            data.data[i].pic_url +
            '" data-toggle="lightbox"> <img src="' +
            data.data[i].pic_url +
            '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
            data.data[i].character +
            "<br/> 生活風格：" +
            data.data[i].lifestyle +
            "<br/> 性別：" +
            data.data[i].gender +
            '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn"> <option selected disabled>' +
            data.data[i].character +
            "</option>" +
            CS +
            ' </select ><br/> <select id="life_style" class="btn btn-mini result_btn"> <option selected disabled>' +
            data.data[i].lifestyle +
            "</option>" +
            LS +
            ' </select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
            data.data[i].gender +
            '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' +
            data.data[i].pic_id +
            '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success">儲存</button> </td></tr>';


          $("#character").append(character);
          //   console.log(data.character_style[i])
          //   console.log( character )  
        }

        $('#characterTime').append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)

        $(".btn-success").click(function () {

          var send_character_style = $(this).parent().parent().find('#character_style option:selected').val();
          var send_life_style = $(this).parent().parent().find('#life_style option:selected').val();
          var send_character_gender = $(this).parent().parent().find('#character_gender option:selected').val();
          var pic_id = $(this).parent().parent().find('#pic_id').val();
          var modify_person = localStorage.getItem('userName');

          console.log(send_character_style, send_life_style, send_character_gender, pic_id, modify_person);

          var data = JSON.stringify({
            imageid: pic_id,
            life_style: send_life_style,
            character_style: send_character_style,
            gender: send_character_gender,
            modify_person: modify_person
          })
          console.log(data);
          $.ajax({
            url: ip + "/img-recognition/style_modify",
            type: "POST",
            headers: {
              Authorization: "Bearer " + jwt
            },
            data: data,
            contentType: "application/json; charset=utf-8",
            error: function (xhr) {
              console.log("傳送風格辨識結果失敗");
              console.log(xhr);
            },
            success: function (data) {
              console.log("傳送風格辨識結果成功");
              // console.log(data.character_style[1]);
              console.log(data);
              alert('修改成功')
            }
          });

        });

        $("#set_character_data").modal("toggle");
        // window.location.reload();

        // $('#set_character_data').modal('hide');
      }
    });
  });




  //設定色彩校正時間區間
  $("#color_search").click(function () {
    alert("color_search");
    var color_start_date = $("#color_start_date").val();
    var color_end_time = $("#color_end_time").val();
    var color_modify_status =
      $('input[name="color_modify_status"]:checked').val() == "true" ?
      true :
      false;
    var page_num = 1;

    var color_data = JSON.stringify({
      start_date: color_start_date,
      end_date: color_end_time,
      modify_status: color_modify_status,
      page_num: 1
    });

    console.log(color_data);

    $.ajax({
      url: ip + "/img-recognition/color_recongition",
      type: "POST",
      headers: {
        Authorization: "Bearer " + jwt
      },
      data: color_data,
      contentType: "application/json; charset=utf-8",
      error: function (xhr) {
        console.log("傳送色彩校正時間區間失敗");
        console.log(xhr);
      },
      success: function (data) {
        console.log("傳送色彩校正時間區間成功");
        // console.log(data.character_style[1]);
        console.log(data);

        for (i = 0; i < data.data.length; i++) {
          color =
            ' <tr> <th scope="row">' +
            data.data[i].kol_name +
            '</th> <td> <a href="' +
            data.data[i].pic_url +
            '" data-toggle="lightbox"> <img src="' +
            data.data[i].pic_url +
            '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ?????? </td><td> ' +
            data.data[i].color[0].RGB +
            '</td><td> <select class="btn btn-mini result_btn"> <option selected disabled>照片風格</option> <option>正確</option> <option>待修正</option> </select> </td><td> <button type="button" class="btn btn-success">儲存</button> </td></tr>';
          $("#color").append(color);
          //   console.log(data.character_style[i])
          //   console.log( character )
        }
        localStorage.setItem("color_start_date", color_start_date);
        localStorage.setItem("color_end_time", color_end_time);
        localStorage.setItem("color_modify_status", color_modify_status);
        $("#set_color_data").modal("toggle");
        // window.location.reload();

        // $('#set_character_data').modal('hide');
      }
    });
  });



  //人物辨識下一頁
  $('#character_nextPage').click(function () {
    window.location.reload();
  })

  //品牌校正下一頁
  $('#brand_nextPage').click(function () {
    window.location.reload();
  })



  //設定品牌校正時間區間
  $("#brand_search").click(function () {
    var brand_start_date = $("#brand_start_date").val();
    var brand_end_date = $("#brand_end_time").val();
    var brand_modify_status =
      $('input[name="brand_modify_status"]:checked').val() == "true" ? true : false;
    var page_num = 1;

    var brand_storage = JSON.stringify({
      start_date: brand_start_date,
      end_date: brand_end_date,
      modify_status: brand_modify_status,
      page_num: 1
    });

    $.ajax({
      url: ip + "/img-recognition/brand_recongition",
      type: "POST",
      headers: {
        Authorization: "Bearer " + jwt
      },
      data: brand_storage,
      contentType: "application/json; charset=utf-8",
      error: function (xhr) {
        console.log("傳送品牌校正時間區間失敗");

        console.log(xhr);
        console.log(brand_storage)
        // window.location.reload();

      },
      success: function (data) {
        console.log("傳送品牌校正時間區間成功");
        brand_total = '<p >共 5 / ' + data.count + '</p>';
        console.log(total);
        localStorage.setItem("brand_start_date", brand_start_date);
        localStorage.setItem("brand_end_date", brand_end_date);
        localStorage.setItem("brand_modify_status", brand_modify_status);
        // console.log(data.character_style[1]);
        console.log(data);
        // console.log(data.data[0].kol_id);
        $("#brand").empty();
        $(".brand_total").empty();
        $('.brand_total').append(brand_total);

        for (i = 0; i < data.data.length; i++) {
          brand =
            "<tr> <td>" +
            data.data[i].kol_name +
            '</td><td> <a href="' +
            data.data[i].pic_url +
            '" data-toggle="lightbox"> <img src="' +
            data.data[i].pic_url +
            '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ' + data.data[i].brand + ' </td><td> 辨識結果QQ </td><td> <button id="brand_save" type="button" class="btn btn-success">儲存</button> </td></tr>';


          $("#brand").append(brand);
          //   console.log(data.character_style[i])
          //   console.log( character )  
        }
      $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)


        //   $("#brand_save").click(function() {

        //     var send_character_style = $(this).parent().parent().find('#character_style option:selected').val();
        //     var send_life_style = $(this).parent().parent().find('#life_style option:selected').val();
        //     var send_character_gender = $(this).parent().parent().find('#character_gender option:selected').val();
        //     var pic_id = $(this).parent().parent().find('#pic_id').val();
        //     var modify_person = localStorage.getItem('userName');

        //     console.log(send_character_style,send_life_style,send_character_gender,pic_id,modify_person);

        //     var data = JSON.stringify({
        //       imageid:pic_id,
        //       life_style:send_life_style,
        //       character_style:send_character_style,
        //       gender:send_character_gender,
        //       modify_person:modify_person
        //     })
        //     console.log(data);
        //     $.ajax({
        //     url: ip+"/img-recognition/style_modify",
        //     type: "POST",
        //     headers: {
        //       Authorization: "Bearer " + jwt
        //     },
        //     data:data,
        //      contentType: "application/json; charset=utf-8",
        //     error: function(xhr) {
        //       console.log("傳送風格辨識結果失敗");
        //       console.log(xhr);
        //     },
        //     success: function(data) {
        //       console.log("傳送風格辨識結果成功");
        //       // console.log(data.character_style[1]);
        //       console.log(data);
        //       alert('修改成功')
        //     }
        //   });

        // });

        $("#set_brand_data").modal("toggle");
        // window.location.reload();

        // $('#set_character_data').modal('hide');
      }
    });
  });

})