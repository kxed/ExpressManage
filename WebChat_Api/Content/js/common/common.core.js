// 页面相关
var page = {
	dom: function (domName, className) {
		return $("<" + domName + ">").addClass(className);
	},
	setStorage: function (k, v) {
		return sessionStorage.setItem(k, v);
	},
	removeStorage: function (k) {
		return sessionStorage.removeItem(k);
	},
	getStorage: function (k) {
		return sessionStorage.getItem(k);
	},
	/**
    * ---解析url对应的参数----
    * @author 847789
    * @time 2016年08月02日
    * @param name 参数名（key）
    * @returns 返回参数名下的参数值 （value） 否则返回 false
    */
	getUrlParm: function (key) {
		var paramStr = location.search;
		if (paramStr.length == 0)
			return false;
		if (paramStr.charAt(0) != "?")
			return false;
		// 解码
		paramStr = unescape(paramStr);
		// 去？号
		paramStr = paramStr.substring(1);
		if (paramStr.length == 0)
			return false;
		// 分割参数
		var params = paramStr.split("&");
		var urlValue = null;
		for (var i = 0; i < params.length; i++) {
			if (params[i].indexOf(key) >= 0) {
				// 分割 key 与 value
				urlValue = params[i].split("=");
				urlValue = urlValue[1];
			}
		}
		return urlValue;
	},
	//  判断是否是数组的项
	isInArray: function (arr, val) {
		var i, iLen;
		if (!(arr instanceof Array) || arr.length === 0) {
			return false;
		}
		if (typeof Array.prototype.indexOf === 'function') {
			return !!~arr.indexOf(val)
		}
		for (i = 0, iLen = arr.length; i < iLen; i++) {
			if (val === arr[i]) {
				return true;
			}
		}
		return false;
	},
	/**
     * ---判断xitong----
     * @author 80002155
     * @time 2016年08月16日
     * @return 返回浏览器名称
     */

	versions: function () {
		var u = navigator.userAgent, app = navigator.appVersion;
		return {//移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}()
	/*
 
 
	 versions : function (key){
		 var ua = navigator.userAgent.toLowerCase();
		 if (/iphone|ipad|ipod/.test(ua)) {
			 return "iphone";
		 } else if (/android/.test(ua)) {
			 return"android";
		 }
	 }*/
};
var tools = {
    splitString: function (str, split, index) {
        if (str) {
            var arr = str.split(split);
            if (index >= arr.length) {
                //说明超出数组界限
                return { status: false, returnValue: "" }
            } else {
                return { status: true, returnValue: arr[index] }
            }
        }
        else {
            return { status: false, returnValue: "" }
        }
	}
};
var mutual = {
	// 页面提示
	tipsDialog: function (text, time) {
		time = time ? time : 2000;
		var dialog = $(".dialog-tips");
		if (dialog.length < 1) {
			dialog = page.dom("div", "dialog-tips center-middle hide");
			$("body").append(dialog);
		}

		if ($(".dialog-tips").is(":visible") == true) {
			return;
		}
		if (dialog.hasClass("hide"))
		{
			dialog.removeClass("hide");
		}

		dialog.html(text).fadeIn(500);
		setTimeout(function () {
			dialog.fadeOut(1000);
		}, time);
	},
	// 加载中
	tipsLoading: function (text) {
		// 如果要隐藏，传入空
		// <div class="tips-loading fixed-100 hide">
		//     <p class="box center-middle">数据加载中</p>
		// </div>
		var dialog = $(".tips-loading");
		if (dialog.length < 1) {
			dialog = page.dom("div", "tips-loading fixed-100 hide");
			$("body").append(dialog.append(page.dom("p", "box center-middle")));
		}
		if (text == "" || text == null || text == "undefined") {
			dialog.addClass("hide");
		} else {
			dialog.removeClass("hide").find(".box").text(text);
		}
	},
    /**
         * 用于解决安卓和苹果上按钮被顶到输入框上面
         * btn:为按钮。如$(".confirm-single-btn")
         */
	footerbtn: function (btn) {
	    // 表单获取焦点的时候
	    $("input").focus(function () {
	        if (!page.versions.android) {
	            btn.addClass("hide");
	        }
	    }).blur(function () {//表单失去焦点的时候
	        if (!page.versions.android) {
	            btn.removeClass("hide");
	        }
	    });
	    if (page.versions.android) {
	        window.onresize = function () {
	            var vhk = document.documentElement.clientHeight;
	            if (vhk < vh) {
	                btn.addClass("hide");
	            } else {
	                btn.removeClass("hide");
	            }
	        }
	    } else {
	        btn.removeClass("hide");
	    }
	},
    /**label=="alert" 表示一个按钮的弹窗
         label=="two" 表示两个按钮的弹窗
        tit表示标题
        Info表示弹窗内容
       **/
    knowShade:function(label,tit,info,leftword,rightword,callback){
    var dialogFor=$(".knowshade-box");
    if(dialogFor.length < 1){
        dialogFor = page.dom("div","all-total knowshade-box fixed-100 hide").on("touchmove",function(e){e.preventDefault()});
        var dialog=page.dom("div","big-wrap fixed-100"),
            confor=page.dom("div","lit-mask center-middle"),
            sorryWord=page.dom("p","sorry-word").text(tit),
            conWordadd=page.dom("p","con-word-ad").html(info),
            maskBtn=page.dom("a","mask-btn mar-top").text(leftword).attr("href","javascript:void(0)");
        if(label){
            if(label=="alert"){
                $("body").append(dialogFor.append(dialog,confor.append(sorryWord,conWordadd,maskBtn)));
            }else if(label=="confirm"){
                var leftBtn=page.dom("a","white mar-top con-off").text(leftword).attr("href","javascript:void(0)");
                rightBtn=page.dom("a","redblack mar-top con-sure").text(rightword).attr("href","javascript:void(0)");
                $("body").append(dialogFor.append(dialog,confor.append(sorryWord,conWordadd,leftBtn,rightBtn)));
            }
        }
    }
    dialogFor.removeClass("hide");
    dialogFor.find(".mask-btn").off("click").on("click",function(){
        dialogFor.remove();
    })
    dialogFor.find(".big-wrap").off("click").on("click",function(){
        dialogFor.remove();
    })
    dialogFor.find(".white").off("click").on("click",function(){
        dialogFor.remove();
    })
    dialogFor.find(".redblack").off("click").on("click",function(){
        callback();
        dialogFor.remove();
        return;
    })
}
}
var ctly = {//埋点
    userId: "",//用户id
    phone: "",//手机
    //init: function () {
    //    var _app_key = "9e93da2ce1daea9f7512d25a5c7988f10367fd6f";//测试环境秘钥20161109
    //    var _url = "http://maoap.sf-express.com";//http://maoap.sit.sf-express.com:9280"; 		//测试环境服务端地址
    //    var urlArrs = document.URL.split('/');
    //    if (urlArrs[2] == "ucmp.sf-express.com") {
    //        _app_key = "b138247686568300c78fdb7b1daa7b4f64d9f1f2";//生产环境秘钥
    //        _url = "http://maoap.sf-express.com"; 		//生产环境服务端地址
    //    }
    //    _app_key = "b138247686568300c78fdb7b1daa7b4f64d9f1f2";//生产环境秘钥
    //    _url = "http://maoap.sf-express.com"; 		//生产环境服务端地址
    //    var userinfo = JSON.parse(localStorage.getItem("local_userinfo"));
    //    if (userinfo && userinfo.userId) {
    //        ctly.main(userinfo, _app_key, _url);
    //    } else {
    //        $.ajax({
    //            type: "POST",
    //            dataType: "json",
    //            async: false,
    //            timeout: 3000,
    //            url: "/CustomerManage/ReturnUserInfo",//"/service/weixin/returnTel",
    //            success: function (result) {
    //                var res = JSON.stringify(result);
    //                localStorage.setItem("local_userinfo", res);//保存本地
    //                ctly.main(JSON.parse(result), _app_key, _url);
    //            },
    //            error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                ctly.userId = "";
    //                ctly.phone = "";
    //                Countly.device_id = "";
    //                Countly.init({
    //                    app_key: _app_key,//测试环境秘钥
    //                    url: _url, 		//测试环境服务端地址
    //                    debug: true
    //                });
    //                Countly.begin_session();
    //            }
    //        });
    //    }
    //},
    end: function () {
        ctly.end_session();
    },
    /**
     * key为事件名称
     * segmentation为有用参数，如：用户ID、手机号，可多个  {}
     */
    event: function (_key, _data) {
        _data.userId = ctly.userId;
        //_data.phone = ctly.phone ;
        ctly.add_event({
            key: _key,
            segmentation: _data
        });
    },
    main: function (result, _app_key, _url) {
        ctly.userId = result.userId;
        ctly.phone = result.tel;
        ctly.init({
            app_key: _app_key,//测试环境秘钥
            url: _url,//测试环境服务端地址
            debug: true
        });
        //Countly.device_id = getId()+":"+result.userId;
        if (ctly.device_id.lastIndexOf(result.userId) < 0) {
            ctly.device_id = result.userId + ":" + ctly.device_id;
        }
        //console.log("ctly.device_id:::::::::::::::"+ctly.device_id);
        ctly.begin_session();
    }

};
