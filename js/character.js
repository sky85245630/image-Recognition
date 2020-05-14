$(document).ready(function () {

    var local_character_start_date = localStorage.getItem('character_start_date')
    var local_character_end_time = localStorage.getItem('character_end_time')
    var character_page_num = localStorage.getItem('character_page_num')

    var local_modify_status = localStorage.getItem('modify_status') == "true" ? true : false

    var ip = "http://api.i-buzz-system.com";
    // var LS = life_style();
    // var CS = character_style();

    

    $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)



    //生活風格列表
    function life_style() {
        $.ajax({
            url: "http://api.i-buzz-system.com/img-recognition/lifestyle_list",
            type: "GET",
            headers: {
                Authorization: "Bearer " + jwt
            },
            error: function (xhr) {
                console.log("取得生活風格列表失敗");
                console.log(xhr)
                window.location.reload();

            },
            success: function (data) {
                console.log("取得生活風格列表成功");
                for (i = 0; i < data.lifestyle_list.length; i++) {
                    LS = '<option name="' + data.lifestyle_list[i] + '" value="' + data.lifestyle_list[i] + '">' + data.lifestyle_list[i] + '</option>'
                    $('.life_style').append(LS)
                }
            }
        })

    }
    //end生活風格列表


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
                    CS = '<option name="' + data.characterstyle_list[i] + '" value="' + data.characterstyle_list[i] + '">' + data.characterstyle_list[i] + '</option>';
                    $('.character_style').append(CS)
                }
            }

        })

    }
    //end人物風格列表

    //儲存人物辨識資料
    function save_character(){
        $(".btn-character").click(function () {

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
    }
    //end儲存人物辨識資料


    //selected_page
    function selected_page(){
        $.ajax({
            url: ip + "/img-recognition/style_recongition",
            type: "POST",
            headers: {
                Authorization: "Bearer " + jwt
            },
            data: storage,
            async:true,
            contentType: "application/json; charset=utf-8",
            error: function (xhr) {
                console.log("selected_page錯誤");
                console.log(xhr);
                // window.location.reload();
            },
            success: function (data) {

                console.log("selected_page成功");
                console.log(data.data.length);
                console.log(typeof(data.data.length));

                // total = '<p>第' + localStorage.getItem('character_page_num') +'頁</p><p>第 ' + data.data.length + '筆 / 共 ' + data.count + '筆</p>'
                $('#total_page').empty();
                for(i = 1 ; i<=Math.floor(data.count/5+1);i++){
                    total_page = "<option value=" + i + ">第"+ i +"頁</option>"
                    $('#total_page').append(total_page);
                }
                                // window.location.reload();

                // console.log(Math.floor(data.count/5+1));
            }
        });
    }
    //end selected_page


    //拉出local Storage資料顯示在畫面上CHARACTER

    //判斷是辨識過或未辨識過的資料
    var check_recognition = local_modify_status == "true" ? character_page_num:1;


    var storage = JSON.stringify({
        start_date: local_character_start_date,
        end_date: local_character_end_time,
        modify_status: local_modify_status,
        page_num: check_recognition
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
            total = '<p >第 '+data.num_of_data+' / ' + data.count + '</p>';
            console.log(total);
            
            $('.total').append(total);
            if (local_modify_status == false) {
                // window.location.reload();
                $('#character_prePage').hide();
                $('#total_page').hide();

            }
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
                    '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn character_style"> <option selected disabled>' +
                    data.data[i].character +
                    '</option></select ><br/> <select id="life_style" class="btn btn-mini result_btn life_style"> <option selected disabled>' +
                    data.data[i].lifestyle +
                    '</option>"</select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].gender +
                    '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success btn-character">儲存</button> </td></tr>';



                $("#character").append(character);
                
                //   console.log(data.character_style[i])
                //   console.log( character )


            }
            $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)
            selected_page();
            save_character();
            life_style();
            character_style();
            // $('#set_character_data').modal('hide');
        }
    });

    //結束拉出local Storage資料顯示在畫面上CHARACTER



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
                total = '<p >第 '+data.num_of_data+' / ' + data.count + '</p>';
                console.log(total);
                localStorage.setItem("character_start_date", character_start_date);
                localStorage.setItem("character_end_time", character_end_time);
                localStorage.setItem("modify_status", modify_status);
                // console.log(data.character_style[1]);
                console.log(data);
                if (local_modify_status == false) {
                    // window.location.reload();
                    $('#character_prePage').hide();
                    $('#total_page').hide();
    
                }
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
                    '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn character_style"> <option selected disabled>' +
                    data.data[i].character +
                    '</option></select ><br/> <select id="life_style" class="btn btn-mini result_btn life_style"> <option selected disabled>' +
                    data.data[i].lifestyle +
                    '</option>"</select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].gender +
                    '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success btn-character">儲存</button> </td></tr>';


                    $("#character").append(character);
                    //   console.log(data.character_style[i])
                    //   console.log( character )  
                }

                $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)
                selected_page();
                save_character();
                life_style() 
                character_style()
                //不知道當時怎麼這樣寫....？
                window.location.reload();

                $("#set_character_data").modal("toggle");
                // window.location.reload();

                // $('#set_character_data').modal('hide');
            }
        });


    });


    //先把預設的character_page_num = 1
    // localStorage.setItem('character_page_num', 1)


    //人物辨識下一頁
    $('#character_nextPage').click(function () {
        // window.location.reload();
        var local_modify_status = localStorage.getItem('modify_status') == "true" ? true : false
        console.log(typeof (page_num))
        var character_page_num = localStorage.getItem('character_page_num')

        //為辨識的資料reload()
        if (local_modify_status == false) {
            window.location.reload();
        }
        //以辨識的資料->換頁
        if (local_modify_status == true) {
            //按一下+1去下一頁
            localStorage.setItem('character_page_num', Number(character_page_num) + 1)


            //拉出local Storage資料顯示在畫面上CHARACTER

            var storage = JSON.stringify({
                start_date: local_character_start_date,
                end_date: local_character_end_time,
                modify_status: local_modify_status,
                page_num: Number(character_page_num)+1
            });
            console.log(storage)
            
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

                    console.log("CHARACTER Local Storage取得成功");
                    // console.log(data.character_style[1]);
                    console.log(data.data.length);
                    console.log(typeof(data.data.length));

                    total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                    // total = '<p>第' + localStorage.getItem('character_page_num') +'頁</p><p>第 ' + data.data.length + '筆 / 共 ' + data.count + '筆</p>'

                    // for(i = 0 ; i<Math.floor(data.count/5+1);i++){
                    //     total_page = "<select><option value=" + i + ">第"+ i +"頁</option></select>"
                    //     $('.total_page').append(total_page);
                    // }
                    

                    console.log(Math.floor(data.count/5+1));
                    $('.total').empty().append(total);
                    console.log(data.data.length)
                    $("#character").empty()
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
                    '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn character_style"> <option selected disabled>' +
                    data.data[i].character +
                    '</option></select ><br/> <select id="life_style" class="btn btn-mini result_btn life_style"> <option selected disabled>' +
                    data.data[i].lifestyle +
                    '</option>"</select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].gender +
                    '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success btn-character">儲存</button> </td></tr>';



                        $("#character").append(character);
                        //   console.log(data.character_style[i])
                        //   console.log( character )


                    }

                    $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)

                    selected_page();
                    save_character();
                    life_style();
                    character_style();


                    // $('#set_character_data').modal('hide');
                }
            });

            //結束拉出local Storage資料顯示在畫面上CHARACTER
        }
    })

    //人物辨識上一頁
     $('#character_prePage').click(function () {
        // window.location.reload();
        var local_modify_status = localStorage.getItem('modify_status') == "true" ? true : false
        console.log(typeof (page_num))
        var character_page_num = localStorage.getItem('character_page_num')

        //為辨識的資料reload()
        if (local_modify_status == false) {
            window.location.reload();
        }
        //以辨識的資料->換頁
        if (local_modify_status == true && Number(character_page_num)>1) {
            //按一下+1去下一頁
            localStorage.setItem('character_page_num', Number(character_page_num) - 1)


            //拉出local Storage資料顯示在畫面上CHARACTER

            var storage = JSON.stringify({
                start_date: local_character_start_date,
                end_date: local_character_end_time,
                modify_status: local_modify_status,
                page_num: Number(character_page_num)-1
            });
            console.log(storage)
            
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

                    console.log("CHARACTER Local Storage取得成功");
                    // console.log(data.character_style[1]);
                    console.log(data.data.length);
                    console.log(typeof(data.data.length));

                    total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                    console.log(total);
                    $('.total').empty().append(total);
                    console.log(data.data.length)
                    $("#character").empty()
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
                    '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn character_style"> <option selected disabled>' +
                    data.data[i].character +
                    '</option></select ><br/> <select id="life_style" class="btn btn-mini result_btn life_style"> <option selected disabled>' +
                    data.data[i].lifestyle +
                    '</option>"</select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].gender +
                    '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success btn-character">儲存</button> </td></tr>';



                        $("#character").append(character);
                        //   console.log(data.character_style[i])
                        //   console.log( character )


                    }
                    $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)

            selected_page();
            save_character();
            life_style();
            character_style();


                    // $('#set_character_data').modal('hide');
                }
            });

            //結束拉出local Storage資料顯示在畫面上CHARACTER




        }


    })

    //total_page change
    $('#total_page').change(function(){
        var selected_page = $('#total_page :selected').val();
        localStorage.setItem('character_page_num',selected_page)

        var storage = JSON.stringify({
            start_date: local_character_start_date,
            end_date: local_character_end_time,
            modify_status: local_modify_status,
            page_num: Number(selected_page)
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
                console.log("total_page change取得失敗");
                console.log(xhr);
                // window.location.reload();
            },
            success: function (data) {

                console.log("total_page change取得成功");

                total = '<p >第 ' + data.num_of_data + ' / ' + data.count + '</p>';
                // console.log(total);

                $('.total').empty().append(total);
                console.log(data.data.length)
                $("#character").empty()
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
                    '<br/> </td><td> <select id="character_style" class="btn btn-mini result_btn character_style"> <option selected disabled>' +
                    data.data[i].character +
                    '</option></select ><br/> <select id="life_style" class="btn btn-mini result_btn life_style"> <option selected disabled>' +
                    data.data[i].lifestyle +
                    '</option>"</select ><br/> <select id="character_gender" class="btn btn-mini result_btn"> <option selected disabled>' +
                    data.data[i].gender +
                    '</option ><option name="male" value="male">male</option ><option name="female" value="female">female</option><option name="無辨識結果" value="無辨識結果">無辨識結果</option> </select ><input id="pic_id" type="hidden" value="' + data.data[i].pic_id + '"><br/> </td><td> <button id="character_save" type="button" class="btn btn-success btn-character">儲存</button> </td></tr>';



                    $("#character").append(character);
                    //   console.log(data.character_style[i])
                    //   console.log( character )


                }
                $('#characterTime').empty().append('時間區間：' + local_character_start_date + ' ~ ' + local_character_end_time)



                save_character();
                life_style();
                character_style();
                // $('#set_character_data').modal('hide');
            }
        });
    })




})