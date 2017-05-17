// 以下为require返回
define(["zepto", "countly"], function ($, countly) {
    var ctly = {//埋点
        userId: "",//用户id
        phone: "",//手机
        init: function () {
            var _app_key = "9e93da2ce1daea9f7512d25a5c7988f10367fd6f";//测试环境秘钥20161109
            var _url = "http://maoap.sf-express.com";//http://maoap.sit.sf-express.com:9280"; 		//测试环境服务端地址
            var urlArrs = document.URL.split('/');
            if (urlArrs[2] == "ucmp.sf-express.com") {
                _app_key = "b138247686568300c78fdb7b1daa7b4f64d9f1f2";//生产环境秘钥
                _url = "http://maoap.sf-express.com"; 		//生产环境服务端地址
            }
            _app_key = "b138247686568300c78fdb7b1daa7b4f64d9f1f2";//生产环境秘钥
            _url = "http://maoap.sf-express.com"; 		//生产环境服务端地址
            var userinfo = JSON.parse(localStorage.getItem("local_userinfo"));
            if (userinfo && userinfo.userId) {
                ctly.main(userinfo, _app_key, _url);
            } else {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: false,
                    timeout: 3000,
                    url: "/CustomerManage/ReturnUserInfo",//"/service/weixin/returnTel",
                    success: function (result) {
                        var res = JSON.stringify(result);
                        localStorage.setItem("local_userinfo", res);//保存本地
                        ctly.main(JSON.parse(result), _app_key, _url);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        ctly.userId = "";
                        ctly.phone = "";
                        Countly.device_id = "";
                        Countly.init({
                            app_key: _app_key,//测试环境秘钥
                            url: _url, 		//测试环境服务端地址
                            debug: true
                        });
                        Countly.begin_session();
                    }
                });
            }
        },
        end: function () {
            Countly.end_session();
        },
        /**
         * key为事件名称
         * segmentation为有用参数，如：用户ID、手机号，可多个  {}
         */
        event: function (_key, _data) {
            _data.userId = ctly.userId;
            //_data.phone = ctly.phone ;
            Countly.add_event({
                key: _key,
                segmentation: _data
            });
        },
        main: function (result, _app_key, _url) {
            ctly.userId = result.userId;
            ctly.phone = result.tel;
            Countly.init({
                app_key: _app_key,//测试环境秘钥
                url: _url,//测试环境服务端地址
                debug: true
            });
            //Countly.device_id = getId()+":"+result.userId;
            if (Countly.device_id.lastIndexOf(result.userId) < 0) {
                Countly.device_id = result.userId + ":" + Countly.device_id;
            }
            //console.log("Countly.device_id:::::::::::::::"+Countly.device_id);
            Countly.begin_session();
        }

    };
    return ctly;
});
