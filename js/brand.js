$(document).ready(function () {

    var local_brand_start_date = localStorage.getItem('brand_start_date')
    var local_brand_end_time = localStorage.getItem('brand_end_date')
    var local_brand_modify_status = localStorage.getItem('brand_modify_status') == "true" ? true : false


    var BL = brand_list()


    $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)



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
                    '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ' + data.data[i].brand + ' </td><td>  <select id="brand_list" class="btn btn-mini result_btn"><option name="無法辨識結果" value="無法辨識結果">無法辨識結果</option>' + BL + '</select><input id="brand_pic_id" type="hidden" value="' + data.data[i].pic_id + '"> </td><td> <button id="brand_save" type="button" class="btn btn-success btn-brand">儲存</button> </td></tr>';

                $("#brand").append(brand);

            }
            $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)
            brand_send();

            // $("#set_brand_data").modal("toggle");
            // window.location.reload();
            // $('#set_character_data').modal('hide');
        }
    });

    //end拉出local Storage資料顯示在畫面上BRAND






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
                        '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ' + data.data[i].brand + ' </td><td> <select id="brand_list" class="btn btn-mini result_btn"><option name="無法辨識結果" value="無法辨識結果">無法辨識結果</option>' + BL + '</select><input id="brand_pic_id" type="hidden" value="' + data.data[i].pic_id + '"></td><td> <button id="brand_save" type="button" class="btn btn-success btn-brand">儲存</button> </td></tr>';


                    $("#brand").append(brand);
                    //   console.log(data.character_style[i])
                    //   console.log( character )  
                }
                $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)

                brand_send();

                $("#set_brand_data").modal("toggle");
                // window.location.reload();

                // $('#set_character_data').modal('hide');
            }
        });
    });
    //end 設定品牌校正時間區間





    //brand send function
    function brand_send() {
        $('.btn-brand').click(function () {
            var send_brand_style = $(this).parents().find('#brand_list option:selected').val();
            var brand_pic_id = $(this).parents().find('#brand_pic_id').val();
            var modify_person = localStorage.getItem('userName');

            console.log(send_brand_style, brand_pic_id, modify_person);

            var data = JSON.stringify({
                imageid: brand_pic_id,
                brand: send_brand_style,
                modify_person: modify_person
            })
            console.log(data);
            $.ajax({
                url: ip + "/img-recognition/brand_modify",
                type: "POST",
                headers: {
                    Authorization: "Bearer " + jwt
                },
                data: data,
                contentType: "application/json; charset=utf-8",
                error: function (xhr) {
                    console.log("傳送品牌辨識結果失敗");
                    console.log(xhr);
                },
                success: function (data) {
                    console.log("傳送品牌辨識結果成功");
                    // console.log(data.character_style[1]);
                    console.log(data);
                    alert('修改成功')
                }
            });
        })
    }
    //end brand send function


    //品牌列表
    function brand_list() {
        $.ajax({
            url: "http://api.i-buzz-system.com/img-recognition/get_brands",
            type: "GET",
            headers: {
                Authorization: "Bearer " + jwt
            },
            error: function (xhr) {
                console.log("取得品牌列表失敗");
                console.log(xhr)
                window.location.reload();
            },
            success: function (data) {
                console.log("取得品牌列表成功");
                for (i = 0; i < data.data.length; i++) {
                    BL += '<option name="' + data.data[i] + '" value="' + data.data[i] + '">' + data.data[i] + '</option>'
                }
                // return BL;
                // console.log(BL);

            }
        })

    }
    //end品牌列表


































    
    //先把預設的brand_page_num = 1
    localStorage.setItem('brand_page_num', 1)


    //人物辨識下一頁
    $('#brand_nextPage').click(function () {
        // window.location.reload();
        var local_brand_modify_status = localStorage.getItem('modify_status') == "true" ? true : false
        var brand_page_num = localStorage.getItem('brand_page_num')


        //為辨識的資料reload()
        if (local_brand_modify_status == false) {
            window.location.reload();
        }
        //以辨識的資料->換頁
        if (local_brand_modify_status == true) {
            //按一下+1去下一頁
            localStorage.setItem('brand_page_num', Number(character_page_num) + 1)


            //拉出local BRAND

            var brand_local_storage = JSON.stringify({
                start_date: local_brand_start_date,
                end_date: local_brand_end_time,
                modify_status: local_brand_modify_status,
                page_num: Number(brand_page_num)+1
            });
            console.log(storage)
            
                
    $.ajax({
        url: ip + "/img-recognition/brand_recongition",
        type: "POST",
        headers: {
            Authorization: "Bearer " + jwt
        },
        data: brand_local_storage,
        contentType: "application/json; charset=utf-8",
        error: function (xhr) {
            console.log("BRAND 下一頁 Storage尚無資料");

            console.log(xhr);
            console.log(brand_local_storage)
            // window.location.reload();

        },
        success: function (data) {
            console.log("BRAND 下一頁 Storage取得資料成功");
            brand_total = '<p >共 '+ data.data.length +' / ' + data.count + '</p>';
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
                    '" class="img-fluid rounded" style="max-width: 200px;"/> </a> </td><td class="recognition_result"> ' + data.data[i].brand + ' </td><td>  <select id="brand_list" class="btn btn-mini result_btn"><option name="無法辨識結果" value="無法辨識結果">無法辨識結果</option>' + BL + '</select><input id="brand_pic_id" type="hidden" value="' + data.data[i].pic_id + '"> </td><td> <button id="brand_save" type="button" class="btn btn-success btn-brand">儲存</button> </td></tr>';

                $("#brand").append(brand);
            }
            $('#brandTime').empty().append('時間區間：' + local_brand_start_date + ' ~ ' + local_brand_end_time)
            // $("#set_brand_data").modal("toggle");
            // window.location.reload();
            brand_send();
            // $('#set_character_data').modal('hide');
        }
    });

            //結束拉出local Storage資料顯示在畫面上BRAND
        }


    })
























})