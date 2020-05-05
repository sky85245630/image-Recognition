$(document).ready(function(){
    
    var local_picture_start_date = localStorage.getItem('picture_start_date')
    var local_picture_end_time = localStorage.getItem('picture_end_time')
    var picture_page_num = localStorage.getItem('picture_page_num')

    var local_picture_modify_status = localStorage.getItem('picture_modify_status') == "true" ? true : false

    var GP = get_picstyle();
    

    

    $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)


    
    
    //取得圖片風格能辨識結果
    function get_picstyle() {
        $.ajax({
            url: "http://api.i-buzz-system.com/img-recognition/get_picstyle",
            type: "GET",
            headers: {
                Authorization: "Bearer " + jwt
            },
            // cache: false,
            async: true,

            error: function (xhr) {
                console.log("取得取得圖片風格能辨識結果失敗");
                console.log(xhr)
                // window.location.reload();

            },
            success: function (data) {
                console.log("取得圖片風格能辨識結果成功");
                console.log(data.data[1]);
                for (i = 0; i < data.data.length; i++) {
                    GP += '<option name="' + data.data[i] + '" value="' + data.data[i] + '">' + data.data[i] + '</option>'
                }
            }
        })

    }
    //end生活風格列表


    //picture_selected_page
    function picture_selected_page(){
        $.ajax({
            url: ip + "/img-recognition/picture_recongition",
            type: "POST",
            headers: {
                Authorization: "Bearer " + jwt
            },
            data: picture_storage,
            async:true,
            contentType: "application/json; charset=utf-8",
            error: function (xhr) {
                console.log("picture_selected_page錯誤");
                console.log(xhr);
                // window.location.reload();
            },
            success: function (data) {

                console.log("picture_selected_page成功");
                console.log(data.data.length);
                console.log(typeof(data.data.length));

                // total = '<p>第' + localStorage.getItem('character_page_num') +'頁</p><p>第 ' + data.data.length + '筆 / 共 ' + data.count + '筆</p>'
                $('#picture_total_page').empty();
                for(i = 1 ; i<=Math.floor(data.count/5+1);i++){
                    picture_total_page = "<option value=" + i + ">第"+ i +"頁</option>"
                    $('#picture_total_page').append(picture_total_page);
                }
                                // window.location.reload();

                // console.log(Math.floor(data.count/5+1));
            }
        });
    }
    //end picture_selected_page







    
    //拉出local Storage資料顯示在畫面上PICTURE

    //判斷是辨識過或未辨識過的資料
    var check_picture_recognition = local_picture_modify_status == "true" ? picture_page_num:1;


    var picture_storage = JSON.stringify({
        start_date: local_picture_start_date,
        end_date: local_picture_end_time,
        modify_status: local_picture_modify_status,
        page_num: check_picture_recognition
    });

    $.ajax({
        url: ip + "/img-recognition/picture_recongition",
        type: "POST",
        headers: {
            Authorization: "Bearer " + jwt
        },
        data: picture_storage,
        contentType: "application/json; charset=utf-8",
        error: function (xhr) {
            console.log("PICTURE Local Storage尚無資料");
            console.log(xhr);
            // window.location.reload();
        },
        success: function (data) {

            console.log("PICTURE Local Storage取得成功");
            // console.log(data.character_style[1]);
            console.log(data);
            picture_total = '<p >第 '+data.num_of_data+' / ' + data.count + '</p>';
            
            $('.picture_total').append(picture_total);
            if (local_picture_modify_status == false) {
                // window.location.reload();
                $('#picture_prePage').hide();
                $('#picture_total_page').hide();
            }
            for (i = 0; i < data.data.length; i++) {
                picture ="<tr> <td>" +
                data.data[i].kol_name +
                '</td><td> <a href="' +
                data.data[i].pic_url +
                '" data-toggle="lightbox"> <img src="' +
                data.data[i].pic_url +
                '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
                data.data[i].picture_style +
                '<br/> </td><td> <select id="picture_style" class="btn btn-mini result_btn"> <option selected disabled>' +
                data.data[i].picture_style +
                "</option>" +
                GP +
                ' </select ><input id="picture_pic_id" type="hidden" value="' +
                data.data[i].pic_id +
                '"></td><td> <button id="picture_save" type="button" class="btn btn-success btn-picture">儲存</button> </td></tr>';



                $("#picture").append(picture);
                //   console.log(data.character_style[i])
                //   console.log( character )


            }
            $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)
            picture_selected_page();
            save_picture();
        }
    });

    //結束拉出local Storage資料顯示在畫面上PICTURE




     //設定圖片校正時間區間
     $("#picture_search").click(function () {
        //  alert('asd')
        var picture_start_date = $("#picture_start_date").val();
        var picture_end_time = $("#picture_end_time").val();
        var picture_modify_status =
            $('input[name="picture_modify_status"]:checked').val() == "true" ?
            true :
            false;
        var page_num = 1;

        var storage = JSON.stringify({
            start_date: picture_start_date,
            end_date: picture_end_time,
            modify_status: picture_modify_status,
            page_num: 1
        });

        $.ajax({
            url: ip + "/img-recognition/picture_recongition",
            type: "POST",
            headers: {
                Authorization: "Bearer " + jwt
            },
            data: storage,
            contentType: "application/json; charset=utf-8",
            error: function (xhr) {
                console.log("傳送圖片校正時間區間失敗");

                console.log(xhr);
                console.log(storage)
                window.location.reload();

            },
            success: function (data) {
                console.log("傳送圖片校正時間區間成功OOOOO");
                picture_total = '<p >第 '+data.num_of_data+' / ' + data.count + '</p>';
                console.log(total);
                localStorage.setItem("picture_start_date", picture_start_date);
                localStorage.setItem("picture_end_time", picture_end_time);
                localStorage.setItem("picture_modify_status", picture_modify_status);
                // console.log(data.character_style[1]);
                console.log(data);
                if (local_picture_modify_status == false) {
                    // window.location.reload();
                    $('#picture_prePage').hide();
                    $('#picture_total_page').hide();
    
                }
                // console.log(data.data[0].kol_id);
                $("#picture").empty();
                $(".picture_total").empty();
                $('.picture_total').append(picture_total);

                for (i = 0; i < data.data.length; i++) {
                    picture =
                        "<tr> <td>" +
                        data.data[i].kol_name +
                        '</td><td> <a href="' +
                        data.data[i].pic_url +
                        '" data-toggle="lightbox"> <img src="' +
                        data.data[i].pic_url +
                        '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
                        data.data[i].picture_style +
                        '<br/> </td><td> <select id="picture_style" class="btn btn-mini result_btn"> <option selected disabled>' +
                        data.data[i].picture_style +
                        "</option>" +
                        GP +
                        ' </select ><input id="picture_pic_id" type="hidden" value="' +
                        data.data[i].pic_id +
                        '"></td><td> <button id="picture_save" type="button" class="btn btn-success btn-picture">儲存</button> </td></tr>';


                    $("#picture").append(picture);
                    //   console.log(data.character_style[i])
                    //   console.log( character )  
                }

                $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)
                picture_selected_page();
                save_picture();
                window.location.reload();

                $("#set_picture_data").modal("toggle");
                // window.location.reload();

                // $('#set_character_data').modal('hide');
            }
        });


    });

     //end設定圖片校正時間區間






     
    //儲存圖片辨識資料
    function save_picture(){
        $(".btn-picture").click(function () {

            var picture_style = $(this).parent().parent().find('#picture_style option:selected').val();
            var picture_pic_id = $(this).parent().parent().find('#picture_pic_id').val();
            var modify_person = localStorage.getItem('userName');
    
            console.log(JSON.stringify({
                imageid: picture_pic_id,
                picstyle: picture_style,
                modify_person: modify_person
            }));
            var data = JSON.stringify({
                imageid: picture_pic_id,
                picstyle: picture_style,
                modify_person: modify_person
            })
            console.log(data);
            $.ajax({
                url: ip + "/img-recognition/picstyle_modify",
                type: "POST",
                headers: {
                    Authorization: "Bearer " + jwt
                },
                data: data,
                contentType: "application/json; charset=utf-8",
                error: function (xhr) {
                    console.log("儲存圖片辨識結果失敗");
                    console.log(xhr);
                },
                success: function (data) {
                    console.log("儲存圖片辨識結果成功");
                    // console.log(data.character_style[1]);
                    console.log(data);
                    alert('修改成功')
                }
            });
    
        });
    }
    //end儲存人物辨識資料






    //圖片辨識下一頁
    $('#picture_nextPage').click(function () {
        // window.location.reload();
        var local_picture_modify_status = localStorage.getItem('picture_modify_status') == "true" ? true : false
        // console.log(typeof (page_num))
        var picture_page_num = localStorage.getItem('picture_page_num')

        //為辨識的資料reload()
        if (local_picture_modify_status == false) {
            window.location.reload();
        }
        //以辨識的資料->換頁
        if (local_picture_modify_status == true) {
            //按一下+1去下一頁
            localStorage.setItem('picture_page_num', Number(picture_page_num) + 1)


            //拉出local Storage資料顯示在畫面上PICTURE

            var pictur_storage = JSON.stringify({
                start_date: local_picture_start_date,
                end_date: local_picture_end_time,
                modify_status: local_picture_modify_status,
                page_num: Number(picture_page_num)+1
            });
            // console.log(storage)
            
            $.ajax({
                url: ip + "/img-recognition/picture_recongition",
                type: "POST",
                headers: {
                    Authorization: "Bearer " + jwt
                },
                data: pictur_storage,
                contentType: "application/json; charset=utf-8",
                error: function (xhr) {
                    console.log("PICTURE Local Storage下一頁尚無資料");
                    console.log(xhr);
                    // window.location.reload();
                },
                success: function (data) {

                    console.log("PICTURE Local Storage下一頁取得成功");
                    // console.log(data.character_style[1]);
                    
                    picture_total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                    
                    
                    $('.picture_total').empty().append(picture_total);
                    console.log(data.data.length)
                    $("#picture").empty()
                    for (i = 0; i < data.data.length; i++) {
                        picture =
                        "<tr> <td>" +
                        data.data[i].kol_name +
                        '</td><td> <a href="' +
                        data.data[i].pic_url +
                        '" data-toggle="lightbox"> <img src="' +
                        data.data[i].pic_url +
                        '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
                        data.data[i].picture_style +
                        '<br/> </td><td> <select id="picture_style" class="btn btn-mini result_btn"> <option selected disabled>' +
                        data.data[i].picture_style +
                        "</option>" +
                        GP +
                        ' </select ><input id="picture_pic_id" type="hidden" value="' +
                        data.data[i].pic_id +
                        '"></td><td> <button id="picture_save" type="button" class="btn btn-success btn-picture">儲存</button> </td></tr>';


                        $("#picture").append(picture);

                    }

                    $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)

                    picture_selected_page();
                    save_picture();


                    // $('#set_character_data').modal('hide');
                }
            });

            //結束拉出local Storage資料顯示在畫面上picture
        }
    })








    //圖片辨識上一頁
    $('#picture_prePage').click(function () {
        var local_picture_modify_status = localStorage.getItem('picture_modify_status') == "true" ? true : false
        var picture_page_num = localStorage.getItem('picture_page_num')

        //為辨識的資料reload()
        if (local_picture_modify_status == false) {
            window.location.reload();
        }
        //以辨識的資料->換頁
        if (local_picture_modify_status == true && Number(picture_page_num)>1) {
            
            //按一下-1去上一頁
            localStorage.setItem('picture_page_num', Number(picture_page_num) - 1)


            //拉出local Storage資料顯示在畫面上PICTURE

            var pictur_storage = JSON.stringify({
                start_date: local_picture_start_date,
                end_date: local_picture_end_time,
                modify_status: local_picture_modify_status,
                page_num: Number(picture_page_num)-1
            });
            console.log(pictur_storage)
            
            $.ajax({
                url: ip + "/img-recognition/picture_recongition",
                type: "POST",
                headers: {
                    Authorization: "Bearer " + jwt
                },
                data: pictur_storage,
                contentType: "application/json; charset=utf-8",
                error: function (xhr) {
                    console.log("PICTURE Local Storage上一頁尚無資料");
                    console.log(xhr);
                    // window.location.reload();
                },
                success: function (data) {

                    console.log("PICTURE Local Storage上一頁取得成功");
                    // console.log(data.character_style[1]);
                    
                    picture_total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                    
                    
                    $('.picture_total').empty().append(picture_total);
                    console.log(data.data.length)
                    $("#picture").empty()
                    for (i = 0; i < data.data.length; i++) {
                        picture =
                        "<tr> <td>" +
                        data.data[i].kol_name +
                        '</td><td> <a href="' +
                        data.data[i].pic_url +
                        '" data-toggle="lightbox"> <img src="' +
                        data.data[i].pic_url +
                        '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
                        data.data[i].picture_style +
                        '<br/> </td><td> <select id="picture_style" class="btn btn-mini result_btn"> <option selected disabled>' +
                        data.data[i].picture_style +
                        "</option>" +
                        GP +
                        ' </select ><input id="picture_pic_id" type="hidden" value="' +
                        data.data[i].pic_id +
                        '"></td><td> <button id="picture_save" type="button" class="btn btn-success btn-picture">儲存</button> </td></tr>';


                        $("#picture").append(picture);

                    }

                    $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)

                    picture_selected_page();
                    save_picture();


                    // $('#set_character_data').modal('hide');
                }
            });

            //結束拉出local Storage資料顯示在畫面上picture
        }
    })







    



    
    //total_page change
    $('#picture_total_page').change(function(){
        var selected_page = $('#picture_total_page :selected').val();
        localStorage.setItem('picture_page_num',selected_page)

        var storage = JSON.stringify({
            start_date: local_picture_start_date,
            end_date: local_picture_end_time,
            modify_status: local_picture_modify_status,
            page_num: Number(selected_page)
        });
        
        $.ajax({
            url: ip + "/img-recognition/picture_recongition",
            type: "POST",
            headers: {
                Authorization: "Bearer " + jwt
            },
            data: storage,
            contentType: "application/json; charset=utf-8",
            error: function (xhr) {
                console.log("total_page change取得失敗");
                console.log(xhr);
                // window.location.reload();
            },
            success: function (data) {

                console.log("total_page change取得成功");
                picture_total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                $('.picture_total').empty().append(picture_total);
                $("#picture").empty()


                for (i = 0; i < data.data.length; i++) {
                    picture =
                    "<tr> <td>" +
                    data.data[i].kol_name +
                    '</td><td> <a href="' +
                    data.data[i].pic_url +
                    '" data-toggle="lightbox"> <img src="' +
                    data.data[i].pic_url +
                    '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> 人物風格：' +
                    data.data[i].picture_style +
                    '<br/> </td><td> <select id="picture_style" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].picture_style +
                    "</option>" +
                    GP +
                    ' </select ><input id="picture_pic_id" type="hidden" value="' +
                    data.data[i].pic_id +
                    '"></td><td> <button id="picture_save" type="button" class="btn btn-success btn-picture">儲存</button> </td></tr>';


                    $("#picture").append(picture);

                }

                $('#pictureTime').empty().append('時間區間：' + local_picture_start_date + ' ~ ' + local_picture_end_time)

                save_picture();


                // $('#set_character_data').modal('hide');
            }
        });
    })






























})