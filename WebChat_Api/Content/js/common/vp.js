(function () {
    var html = document.documentElement,
        meta = document.querySelector('meta[name="viewport"]');
    function init(dpr, flag) {
        //var scale = 1 / dpr;
        var scale = 1;
        var vw = html.clientWidth,
            vh = html.clientHeight;
        // if (flag) {
        //     vw = html.clientWidth / dpr;
        // }
        vw = vw < 320 ? 320 : vw;
        vw = vw > 640 ? 640 : vw;
        //var rem = vw * dpr / 64 * 2;
        var rem = vw / 640 * 20;

        html.setAttribute("data-dpr", dpr);// 动态写入样式
        //meta.setAttribute('content', 'width=' + "device-width" + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');// 设置data-dpr属性，留作的css hack之用
        html.style.fontSize = rem + "px";
        window.vw = vw;
        window.vh = vh;
    }
    init(window.devicePixelRatio || 1);
    window.onresize = function () {
        init(window.devicePixelRatio || 1, true);
    };


    // 安卓，禁止用户缩放字号
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", handleFontSize);
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke("setFontSizeCallback", {
            "fontSize": 0
        });

        // 重写设置网页字体大小的事件
        WeixinJSBridge.on("menu:setfont", function () {
            WeixinJSBridge.invoke("setFontSizeCallback", {
                "fontSize": 0
            });
        });
    }

})();
