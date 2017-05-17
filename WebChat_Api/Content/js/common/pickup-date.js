/*!
 * PickupData v1.0.0
 * 
 * Copyright (c) 2015-2017 Wang Chen
 * Released under the WangChen license
 *
 * Date: 2017-05-03T10:51:36.477Z
 */

/*
(function ($) {

    var arrayDay = new Array();
    arrayDay.puh("今天");
    arrayDay.puh("明天");
    arrayDay.puh("后天");

    //构建可预约日期
    var arrayT = new Array();
    arrayT.push('08:00~09:00');
    arrayT.push('09:00~10:00');
    arrayT.push('10:00~11:00');
    arrayT.push('11:00~12:00');
    arrayT.push('12:00~13:00');
    arrayT.push('13:00~14:00');
    arrayT.push('14:00~15:00');
    arrayT.push('15:00~16:00');
    arrayT.push('16:00~17:00');
    arrayT.push('17:00~18:00');
    arrayT.push('18:00~19:00');
    arrayT.push('19:00~20:00');
    arrayT.push('20:00~21:00');
    arrayT.push('21:00~22:00');
    arrayT.push('22:00~23:00');
    arrayT.push('23:00~00:00');

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }

    '<div class="city-select-wrap">'
    '<div class="city-select-tab">'
    '<a class="active" data-count="province">今天</a>'
    '<a data-count="city">明天</a>'
    '<a data-count="district">后天</a>'
    '</div>'
    '<div class="city-select-content">'
    '<div class="city-select province" data-count="province" style="display: block;">'
    '<dl class="clearfix">'
    '<dt>A-G</dt>'
    '<dd>'
    '				<a title="安徽省" data-code="340000" class="">安徽省</a>'
    '				<a title="北京市" data-code="110000" class="">北京市</a>'
    '				<a title="重庆市" data-code="500000" class="">重庆市</a>'
    '				<a title="福建省" data-code="350000" class="">福建省</a>'
    '				<a title="甘肃省" data-code="620000" class="">甘肃省</a>'
    '				<a title="广东省" data-code="440000" class="">广东省</a>'
    '				<a title="广西壮族自治区" data-code="450000" class="">广西壮族自治区</a>'
    '				<a title="贵州省" data-code="520000" class="">贵州省</a>'
    '			</dd>'
    '		</dl>'
    '	</div>'
    '</div>'
    '</div>'
    var mainDiv = document.createElement("div");
    $(mainDiv).addClass("city-select-wrap");
    var tabDiv = document.createElement("div");
    $(tabDiv).addClass("city-select-tab");
    var dateNow = new Date();

    /*此处可以循环添加tab选项卡*/
/*
    $.each(arrayDay, function (i, c) {

        var a = document.createElement("a");
        a.innerHTML = c + "(" + dateNow.getFullYear();
    })
    var contentDiv = $(document).createElement("div");
    $(contentDiv).addClass("city-select-conten");
    var toDayDiv = $(document).createElement("div");
    $(toDayDiv).addClass("city-select province");
    /*此处循环添加今天的时间*/
/*
    $(toDayDiv).addClass("city-select");

*/