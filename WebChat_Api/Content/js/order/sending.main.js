requirejs.config({
    baseUrl: "../Content/js",
    //urlArgs : "v="+(new Date()).getTime(),
    urlArgs: "v=20161115",
    paths: {
        zepto: "libs/zepto.min",
        swiper: "libs/swiper.min",
        common: "common/common.hyn",
        countly: "libs/countly.min",
        cmctly: "common/common.countly",
        units: "common/units",
        baidumap: "common/map.baidu",
        sc: "order/sending.common",
        sending: "order/sending",
        map: "common/map",
        qrsending: "scancode/qr-sending",
        spsending: "order/sending-sp",
        login: 'common/login',
        jWeixin: 'libs/jweixin-1.0.0',
        weixinAPI: 'common/weixinAPI'
    }
});

require(["zepto", "common", "units", "baidumap", "map", "cmctly", "sc"], function ($, cm, units, bdMap, map, cmctly, sc) {
    var source = cm.page.getUrlParm("source");
    if (source == "sending") {
        require(["sending"], function (sd) {
            console.log("预约上门.....");
        });
    } else if (source == "QRSending") {
        require(["qrsending"], function (sp) {
            console.log("自寄.....");
        });
    } else if (source == "SPSending") {
        require(["spsending"], function (sp) {
            console.log("服务点自寄.....");
        });
    }
});
//requirejs.config({
//    baseUrl : "../Content/js",
//    //urlArgs : "v="+(new Date()).getTime(),
//    urlArgs : "v=20161115",
//    paths : {
//        zepto : "libs/zepto.min",
//        swiper : "libs/swiper.min",
//        common : "common/common.hyn",
//        countly : "libs/countly.min",
//        cmctly : "common/common.countly",
//        units : "common/units",
//        baidumap : "common/map.baidu",
//        sc : "order/sending.common",
//        sending : "order/sending",
//        map : "common/map",
//        qrsending : "scancode/qr-sending",
//        spsending : "order/sending-sp",
//        login: 'common/login',
//        jWeixin : 'libs/jweixin-1.0.0',
//        weixinAPI : 'common/weixinAPI'
//    }
//});

//require(["zepto","common","units","baidumap","map","cmctly","sc"],function($,cm,units,bdMap,map,cmctly,sc){
//var source = cm.page.getUrlParm("source");
//	if(source =="sending"){
//		require(["sending"],function(sd){
//			console.log("预约上门.....");
//		});
//    }else if(source =="QRSending"){
//		require(["qrsending"],function(sp){
//			console.log("自寄.....");
//		});
//	}else if(source =="SPSending"){
//		require(["spsending"],function(sp){
//			console.log("服务点自寄.....");
//		});
//	}
//});
