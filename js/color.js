$(document).ready(function(){

    var local_color_start_date = localStorage.getItem('color_start_date')
    var local_color_end_time = localStorage.getItem('color_end_time')
    var local_color_modify_status = localStorage.getItem('color_modify_status') == "true" ? true : false
    $('#colorTime').empty().append('時間區間：' + local_color_start_date + ' ~ ' + local_color_end_time)


    

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


})