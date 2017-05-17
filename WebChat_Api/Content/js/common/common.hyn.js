// 以下为require返回
define(["zepto","swiper"],function($,swiper){
    // 页面交互
    var mutual = {
        viewport : function(basic) {
            var html = document.documentElement,
                vw = html.clientWidth,
                vh = html.clientHeight;
            resize();
            window.onresize = resize;
            function resize(){
                vw = html.clientWidth;
                vw = vw < 320 ? 320 : vw;
                vw = vw > 640 ? 640 : vw;
                var fontSize = vw * 20 / basic;
                html.style.fontSize = fontSize + "px";
            }
        },
        viewportNew : function() {
            var html = document.documentElement,
                meta = document.querySelector('meta[name="viewport"]');
            function init(dpr,flag){
                var scale = 1 / dpr;
                var vw = html.clientWidth;
                if (flag) {
                    vw = html.clientWidth / dpr;
                }
                vw = vw < 320 ? 320 : vw;
                vw = vw > 640 ? 640 : vw;
                var rem = vw * dpr / 64 * 2;
                html.setAttribute('data-dpr', dpr);// 动态写入样式
                meta.setAttribute('content', 'width=' + "device-width" + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');// 设置data-dpr属性，留作的css hack之用
                html.style.fontSize = rem + "px";
            }
            init(window.devicePixelRatio || 1);
            window.onresize = function(){
                init(window.devicePixelRatio || 1,true);
            };
        },
    	// 地图图标尺寸转换
    	mapIco : function(x){
    		return x * vw / 640;
    	},
    	// TAB切换
        tab : function(el,callback) {
            if (el.length > 0) {
                el.each(function(){
                    var thisTab = $(this);
                    thisTab.children(".container").find("li").each(function(i){
                		$(this).on("click",function(){
                			$(this).addClass("current").siblings("li").removeClass("current");
                			thisTab.children(".content").eq(i).removeClass("hide").siblings(".content").addClass("hide");
							callback && callback(i);
                		})
                	});
                });
            }
        },
    	// 页面提示
    	tipsDialog : function(text,time){
    		time = time ? time : 2000;
    		var dialog = $(".dialog-tips");
    		if(dialog.length < 1){
    			dialog = page.dom("div","dialog-tips center-middle hide");
    			$("body").append(dialog);
    		}

    		if($(".dialog-tips").is(":visible")==true ){
           	   return;
    		}

    		dialog.html(text).fadeIn(500);
    		setTimeout(function(){
    			dialog.fadeOut(1000);
    		}, time);
    	},
    	// 加载中
    	tipsLoading : function(text){
    		// 如果要隐藏，传入空
            // <div class="tips-loading fixed-100 hide">
            //     <p class="box center-middle">数据加载中</p>
            // </div>
    		var dialog = $(".tips-loading");
    		if(dialog.length < 1){
    			dialog = page.dom("div","tips-loading fixed-100 hide");
    			$("body").append(dialog.append(page.dom("p","box center-middle")));
    		}
    		if(text == "" || text == null || text == "undefined"){
    			dialog.addClass("hide");
    		}else{
    			dialog.removeClass("hide").find(".box").text(text);
    		}
    	},
        // 弹出是/否确认框
        // <div class="dialog-yes-no fixed-100">
        //     <div class="mask fixed-100"></div>
        //     <div class="content center-middle">
        //         <h3 class="title">是否TODO？</h3>
        //         <p class="btn">
        //             <a class="yes" href="javascript:void(0)">是</a>
        //             <a class="on no" href="javascript:void(0)">否</a>
        //         </p>
        //     </div>
        // </div>
        dialogYN : function(text, yesCallback, noCallback){
            var dialog = $(".dialog-yes-no");
    		if(dialog.length == 0){
    			dialog = page.dom("div","dialog-yes-no fixed-100");
    			var mask = page.dom("div","mask fixed-100"),
    			content = page.dom("div","content center-middle"),
    			title = page.dom("h3","title"),
    			btn = page.dom("p","btn"),
    			yes = page.dom("a","yes").attr("href","javascript:void(0)").text("是"),
    			no = page.dom("a","on no").attr("href","javascript:void(0)").text("否");
    			dialog.append( mask, content.append( title, btn.append(yes, no) ) );
    			$("body").append(dialog);
    		}else{
                dialog.removeClass("hide");
                var mask = dialog.find(".mask"),
    			title = dialog.find(".title"),
    			yes = dialog.find(".yes"),
    			no = dialog.find(".no");
    		}
            title.text(text);
            mask.off("click").on("click",function(){
                dialog.addClass("hide");
                noCallback && noCallback();
            });
            yes.off("click").on("click",function(){
                dialog.addClass("hide");
                yesCallback && yesCallback();
            });
            no.off("click").on("click",function(){
                dialog.addClass("hide");
                noCallback && noCallback();
            });
        },
    	// 侧边栏滑出
        aside : function(container, callback){
            if (container.length == 0) {
                return;
            }
            // <aside class="my-nav-aside fixed-100 hide">
            //     <div class="mask"></div>
            //     <div class="wrap">
            //         <figure class="user">
            //             <img src="../../images/demo-sfer.jpg">
            //             <p>登录后即享更多特权</p>
            //         </figure>
            //         <nav class="nav">
            //             <a class="mailbox" href="#">我的信箱</a>
            //             <a class="sending" href="#">寄快递</a>
            //             <a class="query" href="#">查快递</a>
            //             <a class="delivery" href="#">安排派件</a>
            //             <a class="wallet" href="#">我的钱包</a>
            //             <a class="like" href="#">我的偏好</a>
             //             <a class="address" href="#">我的地址簿</a>
            //         </nav>
            //     </div>
            // </aside>
            var fix = $(".my-nav-aside");
            if(fix.length < 1){
                fix = page.dom("aside","my-nav-aside fixed-100 hide").on("touchmove",function(e){e.preventDefault()});
                var mask = page.dom("div","mask"),
                wrap = page.dom("div","wrap"),
                user = page.dom("figure","user").html("<img class=\"click\" src='../Content/images/demo-sfer.jpg'><p class=\"click\">登录后即享更多特权</p>"),
                nav = page.dom("nav","nav").html("<a class='sending' href='/cx/order/sending.html?source=sending'>寄快递</a><a class='query' href='/cx/query/index.html'>查快递</a><a class='wallet' href='/cx/wallet/index.html'>我的钱包</a><a class='address' href='javascript:void(0)' data-url='/cx/order/my-address-book.html?from=aside'>我的地址簿</a><a class='like' href='javascript:void(0)' data-url='/cx/preferences/index.html?from=aside'>个性设置</a><a class='products' href='/cx/services/index.html'>顺丰服务查询</a>"),//<a class='like' href='javascript:void(0)' data-url='/cx/preferences/index.html?from=aside'>个性设置</a><a class='delivery' href='javascript:void(0)'>更改派件信息</a><a class='like' href='javascript:void(0)'>我的偏好</a>
                logout = page.dom("a","logout hide").attr("href","javascript:void(0)").text("退出登录");
                $("body").append(fix.append(mask, wrap.append(user,nav,logout)));
            }
            container.on("click",function(){
                fix.removeClass("hide fadeout").addClass("fadein").find(".mask").on("click",function(){
                    fix.removeClass("fadein").addClass("fadeout");
                    setTimeout(function(){
                        fix.addClass("hide");
                    },400);
                });
                var o = {
                	menu : $(this),
                	user : fix.find(".user"),
                	nav : fix.find(".nav"),
                    logout : fix.find(".logout")
                };
                callback && callback(o);
                // 小屏手机兼容处理
                screenSmall();
                window.onresize = screenSmall;
                function screenSmall(){
                    console.log((o.user.height() + o.nav.height()) + "*" + (vh * 0.9));
                    if((o.user.height() + o.nav.height()) > (vh * 0.9)){
                        fix.addClass("screen-small");
                    }
                }
                //我的偏好链接需要先登录，在跳转
                fix.find('.nav a').on("click",function(){
                    var url = $(this).attr("data-url");
                    if (!url) return;
                	member.isLogin(function(flag){
                		if(flag==true){
                			window.location.href=url;
                		}else{
                			member.loging(function(){
                                console.log("登录完成之后做点操作");
                                window.location.href=url;
                            });
                		}
                	});
                });
                // 登录相关操作
                member.isLogin(function(flag){
                    if(flag){
                        // [show.1] 展示会员头像（如已登录则不再查询）【已登录状态】
                        if (WeixinUser.MemberObj.portrait) {
                            $('.user img').attr('src', WeixinUser.MemberObj.portrait);
                        } else {
                            WeixinUser.getUserBaseInfo(true, function (response) {
                                if (response.success == true) {
                                    var portrait = response.obj.headimgurl;
                                    if (portrait != null && portrait != "" && portrait != "null") {
                                        WeixinUser.MemberObj.portrait = portrait;
                                        $('.user img').attr('src', WeixinUser.MemberObj.portrait);
                                    }
                                }
                            }, function(err) {
                                console.error('查询会员头像失败。');
                            });
                        }
                        // [show.2] 展示会员号（如已登录则不再查询）【已登录状态】
                        if (WeixinUser.MemberObj.userName) {
                            $('.user p').text(WeixinUser.MemberObj.userName);
                            console.debug('展示会员号：' + WeixinUser.MemberObj.userName);
                        } else {
                            WeixinUser.getUserNameAndMob(true, function(response) {
                                var arr = response.split(",") || '';
                                WeixinUser.MemberObj.userName = arr[0];
                                WeixinUser.MemberObj.mobile = arr[1];
                                console.log('查询会员号：' + WeixinUser.MemberObj.userName);
                                $('.user p').text(WeixinUser.MemberObj.userName);
                            }, function(err) {
                                console.error('查询会员名与电话号码失败。');
                            });
                        }

                        // 绑定会员头像点击事件
                        o.user.find(".click").on("click",function(){
                            console.debug("登录状态下点击头像");
                            location.href = '/cx/user/user_info.html';
                        });
                        // 绑定点击侧边栏退出事件
                        o.logout.removeClass("hide").on("click",function(){
                            mutual.dialogYN("您确定要退出登录吗？",function(){
                                console.debug("这里执行退出登录代码");
                                var memberObj = {
                                    mobile: WeixinUser.MemberObj.mobile,
                                    userName: WeixinUser.MemberObj.userName
                                };
                                if (memberObj.mobile && memberObj.userName) {
                                    WeixinUser.membUnbindWechat(true, memberObj, function(response) {
                                        if (response == 'error500') {
                                            alert("系统错误,解绑失败");
                                        }
                                        if (response == 'OK') {
                                            localStorage.removeItem("local_userinfo");
                                            // 刷新页面
                                            // window.location = "/weiwap/newVersion/moduleHomePage/index.html";
                                            location.reload();
                                        }
                                    }, function(error) {
                                        alert('网络异常，请稍候再试。');
                                    })
                                }
                            });
                        });
                    }else{
                        o.logout.addClass("hide");
                        o.user.find(".click").on("click",function(){
                            member.loging(function(){
                                console.log("登录完成之后做点操作");
                                location.href = location.href;
                            });
                        });
                    }
                    console.info("侧边栏展示登录状态\【已登录\<true\>|未登录\<false\>】:" + flag);
                });
            });
        },
    	// 寄件方式弹出
        sendingWay : function(container) {
            if (container.length == 0) {
                return;
            }
            // <section class="fix-sending-way fixed-100 hide">
            //     <a class="my-nav" href="javascript:void(0)"></a>
            //     <a class="close ico-cls" href="javascript:void(0)"></a>
            //     <p class="way center-middle">
            //         <a class="pickup" href="javascript:void(0)">快递员上门</a>
            //         <a class="store" href="javascript:void(0)">嘿客/顺丰门店自寄</a>
            //         <a class="fcbox" href="javascript:void(0)">便利店/丰巢自寄</a>
            //     </p>
            // </section>
            function createFix() {
                var fix = page.dom("section", "fix-sending-way fixed-100 hide"),
                    close = page.dom("a", "close ico-cls").attr("href", "javascript:void(0)").on("click",function(){
                        fix.addClass("hide").removeClass("show");
                    }),
                    way = page.dom("p", "way center-middle");
                var pickup = page.dom("a", "pickup").attr("href", "javascript:void(0)").text("快递员上门");
                var store = page.dom("a", "store").attr("href", "javascript:void(0)").text("嘿客/顺丰门店自寄");
                var fcbox = page.dom("a", "fcbox").attr("href", "javascript:void(0)").text("丰巢/便利店自寄");
                $("body").append( fix.append( close, way.append(pickup, store, fcbox) ) );
                return fix;
            }
            var fix = createFix();
            container.on("click", function() {
                fix.removeClass("hide").addClass("show").find(".way a").on("click",function(){
                    container.text( $(this).text() );
                    fix.addClass("hide").removeClass("show");
                    order.sendingWay = $(this).attr("class");
                });
            });
        },
        // 底部底部弹出框
        // 参数 type(可选contact,single,multiple,switch  联系人信息，单选，多选，开关)
        // 联系人调用：a = COM.mutual.footerFix("contact","预约人信息");
        // 单选调用：a = COM.mutual.footerFix("single",["标题",["111","aaa","ccc"],activeIndex,strict]); strict>是否必选，默认1
        // 多选调用：a = COM.mutual.footerFix("multiple",["标题",["111","aaa","ccc"],[1,2],exclusive]); exclusive>排他项，默认没有
        // 开关调用：a = COM.mutual.footerFix("switch",{title:"标题",t:"项目",p:"描述",on:false});
        footerFix : function(_type, _title, callback){
            // <div class="dialog-contact-fix hide">
            //     <h2 class="title">联系人信息</h2>
                    // <ul class="form-list">
                    //     <li class="d-flex">
                    //         <span>姓名</span>
                    //         <input class="user flex-1" type="text">
                    //     </li>
                    //     <li class="d-flex">
                    //         <span>联系电话</span>
                    //         <input class="tel flex-1" type="tel"><!-- inputting -->
                    //     </li>
                    // </ul>
                    // <ul class="single-style d-flex">
                    //     <li class="on flex-1">电话勿扰</li>
                    //     <li class="flex-1">短信勿扰</li>
                    // </ul>
                    // <ul class="con-box">
                    //     <li class="on switch-style">
                    //         <h3 class="t">拒收</h3>
                    //         <p class="d">确认拒收后将由客服联系寄方协商处理该快件</p>
                    //         <i></i>
                    //     </li>
                    // </ul>
            //     <button class="confirm">确定</button>
            //     <a class="close ico-cls" href="javascript:void(0)"></a>
            // </div>
            var domFix;

            if(_type == "contact"){
                domFix = $(".dialog-footer-fix.contact");
            }else if(_type == "single"){
                domFix = $(".dialog-footer-fix.single");
            }else if(_type == "multiple"){
                domFix = $(".dialog-footer-fix.multiple");
            }else if(_type == "switch"){
                domFix = $(".dialog-footer-fix.switch");
            }
            if(domFix.length < 1){
                var domFix = page.dom("div","dialog-footer-fix fixed-100 hide").on("touchmove",function(e){e.preventDefault()}),
                    mask = page.dom("div","mask fixed-100"),
                    wrap = page.dom("div","wrap"),
                    title = page.dom("h2","title"),
                    ul = page.dom("ul"),
                    li1 = page.dom("li","d-flex"),
                    li2 = page.dom("li","d-flex"),
                    liSwitch = page.dom("li","switch-style").html("<h3 class='t'>" + _title.t + "</h3><p class='d'>" + _title.p + "</p><i></i>").on("click","i",function(){
                        $(this).parents(".switch-style").toggleClass("on");
                    }),
                    span1 = page.dom("span").text("姓名"),
                    user = page.dom("input","user flex-1").attr("type","text"),
                    span2 = page.dom("span").text("联系电话"),
                    tel = page.dom("input","tel flex-1").attr("type","tel"),

                    button = page.dom("button","confirm").text("确定"),
                    close = page.dom("a","close ico-cls").attr("href","javascript:void(0)").on("click",function(){
                        domFix.addClass("hide");
                    });
				if(_type == "contact"){
					title.text(_title);
					$("body").append(domFix.addClass("contact").append( wrap.append(title, ul.addClass("form-list").append( li1.append(span1,user), li2.append(span2,tel) ), button, close),mask ));
				}else if(_type == "single"){
					title.text(_title[0]);
					var singleLIST = "";
                    var activeClass = "";
					if(_title[1].length<4){
                        ul.addClass("d-flex");
						 for(var i = 0; i < _title[1].length; i++){
	                        (function(j){
                                    if(_title[2] == j){
                                        activeClass = " on";
                                    }else{
                                        activeClass = "";
                                    }
	                        		singleLIST += "<li class='flex-1" + activeClass + "'>" + _title[1][j] + "</li>";
	                        })(i);
						 }
					}else{
						var n =2;
						if(_title[1].length%3== 0 ){
							n = 3;
						}
						for(var i= 0 ;i<_title[1].length;i++){
						    (function(j){
                                if(_title[2] == j){
                                    activeClass = " on";
                                }else{
                                    activeClass = "";
                                }
								if(j%n==0){
									if(j!=0){
										singleLIST +="</ul>";
									}
									singleLIST +="<ul class=\"d-flex\">";
								}
								singleLIST +="<li class='flex-1" + activeClass + "'>" + _title[1][j] + "</li>";
                                if(j == (_title[1].length-1) && _title[1].length%2 == 1){
                                    singleLIST +="<div class='flex-1'></div>";
                                }
                                if(j==_title[1].length){
									singleLIST +="</ul>";
								}
						    })(i);
						}
					}
                    ul.addClass("single-style").html( singleLIST ).off("click").on("click","li",function(){
                        $(this).parents("ul.d-flex").siblings("ul").find("li").removeClass("on");
                        $(this).siblings("li").removeClass("on");
                        if(_title[3] == 0){
                            $(this).toggleClass("on");
                        }else{
                            $(this).addClass("on");
                        }
                    });
                    $("body").append(domFix.addClass("single").append( wrap.append(title, ul, button, close ),mask ));
				} else if(_type == "multiple"){
                    console.log("multiple");
    					title.text(_title[0]);
    					var singleLIST = "";
                        var activeClass = "";
    					if(_title[1].length<4){
                            ul.addClass("d-flex");
    						 for(var i = 0; i < _title[1].length; i++){
                                if(page.isInArray(_title[2],i)){
                                        activeClass = " on";
                                }else{
                                        activeClass = "";
    	                        }
                                singleLIST += "<li class='flex-1" + activeClass + "'>" + _title[1][i] + "</li>";
    						 }
    					}else{
    						var n =2;
    						if(_title[1].length%3== 0 ){
    							n = 3;
    						}
    						for(var i= 0 ;i<_title[1].length;i++){
                                    if(page.isInArray(_title[2],i)){
                                        activeClass = " on";
                                    }else{
                                        activeClass = "";
                                    }
    								if(i%n==0){
    									if(i!=0){
    										singleLIST +="</ul>";
    									}
    									singleLIST +="<ul class=\"d-flex\">";
    								}
    								singleLIST +="<li class='flex-1" + activeClass + "'>" + _title[1][i] + "</li>";
                                    if(i == (_title[1].length-1) && _title[1].length%2 == 1){
                                        singleLIST +="<div class='flex-1'></div>";
                                    }
                                    if(i==_title[1].length){
    									singleLIST +="</ul>";
    								}

    						}
    					}
                        ul.addClass("single-style").html( singleLIST ).off("click").on("click","li",function(){
                            if(_title[3] || _title[3] == 0){
                                if($(this).text() == _title[1][_title[3]]){
                                    wrap.find("li").removeClass("on");
                                }else{
                                    wrap.find("li").eq(_title[3]).removeClass("on");
                                }
                            }
                            $(this).toggleClass("on");
                        });
                        $("body").append(domFix.addClass("multiple").append( wrap.append(title, ul, button, close ),mask ));
                }else if(_type == "switch"){
					title.text(_title.title);
					if(_title.on){liSwitch.addClass("on")}
                    $("body").append(domFix.addClass("switch").append( wrap.append(title, ul.addClass("con-box").append( liSwitch ), button, close ),mask));
				}
			}
			$(".dialog-footer-fix").addClass("hide");
			domFix.removeClass("hide");
			var from = {};
            if(_type == "contact"){
                from = {
                    user : domFix.find("input.user"),
                    tel : domFix.find("input.tel"),
                    btn : domFix.find(".confirm"),
                    clos : domFix.find(".close"),
                    close : function(){
                        domFix.addClass("hide");
                    }
                };
				return from;
            }else if(_type == "single" || _type == "multiple"){
                from = {
                    ul : domFix.find(".single-style"),
                    btn : domFix.find(".confirm"),
                    clos : domFix.find(".close"),
                    close : function(){
                        domFix.addClass("hide");
                    }
                };
                callback && callback.call(this,from);
            }else if(_type == "switch"){
                from = {
                    li : liSwitch,
                    btn : domFix.find(".confirm"),
                    clos : domFix.find(".close"),
                    close : function(){
                        domFix.addClass("hide");
                    }
                };
				return from;
            }
        },
        // 运单条款
        protocol : function(callback){
            // <div class="dialog-protocol fixed-100">
            //     <div class="mask fixed-100"></div>
            //     <div class="content center-middle">
            //         <a class="close ico-cls" href="javascript:void(0)"></a>
            //         <div class="box">
            //             <h2>《快件运单契约条款》</h2>
            //             <p>1、	特别声明：寄件人寄递价值超过1000元的物品的，应当在寄件时向本公司如实声明。寄件人未声明的，本公司有权按照不超过1000元的物品处理。如寄件人认为本条款关于赔偿的约定不足以补偿其损失，本公司建议对价值超过1000元的物品选择保价服务。</p>
            //             <p>2、	为保证托寄物安全送达，寄件人寄件时应履行以下义务：</p>
            //             <p>（1）如实申报托寄物内容和价值，并准确、清楚地填写寄件人、收件人的名称、地址、联系电话等资料。</p>
            //             <p>（2）根据托寄物的性质（尤其是易碎品、液体、气体），提供充分的防破损、防漏、防爆措施，保障托寄物安全派送。</p>
            //             <p>（3）本公司有权依法对托寄物进行验视，如发现禁止寄递或者限制寄递的物品，有权移交相关部门处理，并配合相关部门追究寄件人违法寄递的法律责任。</p>
            //         </div>
            //         <a class="confirm" href="javascript:void(0)">同意</a>
            //     </div>
            // </div>
            var result = false;
            var domFix = $(".dialog-protocol");
            if(domFix.length < 1){
                var domFix = page.dom("div","dialog-protocol fixed-100 hide"),
                    mask = page.dom("div","mask fixed-100").on("click",function(){
                        domFix.addClass("hide");
                    }),
                    content = page.dom("div","content center-middle"),
                    close = page.dom("a","close ico-cls").attr("href","javascript:void(0)").on("click",function(){
                        domFix.addClass("hide");
                    });
                    var text = "<h2>《快件运单契约条款》</h2>";
                        text += "<p>1、	特别声明：寄件人寄递价值超过1000元的物品的，应当在寄件时向本公司如实声明。寄件人未声明的，本公司有权按照不超过1000元的物品处理。如寄件人认为本条款关于赔偿的约定不足以补偿其损失，本公司建议对价值超过1000元的物品选择保价服务。</p>";
                        text += "<p>2、	为保证托寄物安全送达，寄件人寄件时应履行以下义务：</p>";
                        text += "<p>（1）	如实申报托寄物内容和价值，并准确、清楚地填写寄件人、收件人的名称、地址、联系电话等资料。</p>";
                        text += "<p>（2）	根据托寄物的性质（尤其是易碎品、液体、气体），提供充分的防破损、防漏、防爆措施，保障托寄物安全派送。</p>";
                        text += "<p>（3）	本公司有权依法对托寄物进行验视，如发现禁止寄递或者限制寄递的物品，有权移交相关部门处理，并配合相关部门追究寄件人违法寄递的法律责任。</p>";
                        text += "<p>3、	关于费用和发票的约定：</p>";
                        text += "<p>（1）	已经收寄的到付快件，如收件人尚未付费，寄件人要求更改为寄件人付费的，应向本公司支付附加服务费。该服务费标准以本公司在官方网站上公布的价格为准。</p>";
                        text += "<p>（2）	寄件人指示在物流中心、保税区等需要支付出/入仓费或其他额外费用的特殊地址收取或派送快件时，寄件人或其指定付款人应当偿还本公司垫付的上述出/入仓费等额外费用，并向本公司支付附加服务费。该服务费标准以本公司在官方网站上公布的价格为准。</p>";
                        text += "<p>（3）	无法派送的托寄物，若寄件人要求退回，则双程费用均由寄件人承担。</p>";
                        text += "<p>（4）	快件费用按照本公司在官方网站上公布或双方书面协议约定的计算标准收取，一方提出快件费用计算错误要求校正的，另一方应当积极配合校正。</p>";
                        text += "<p>（5）	本公司在向月结客户收取月结款时提供发票；有发票需求的非月结客户，请在付款后1个月内持运单原件向本公司索取发票。</p>";
                        text += "<p>4、	关于赔偿的约定：</p>";
                        text += "<p>若因本公司原因造成托寄物丢失、破损、短少、延误的，本公司将免除本次运费。</p>";
                        text += "<p>（1）	未保价快件理赔：寄件人未选择保价的，本公司对月结客户在九倍运费的限额内，对非月结客户在七倍运费的限额内赔偿托寄物的实际损失。</p>";
                        text += "<p>（2）	保价快件理赔：寄件人选择保价且支付保价费用的，托寄物丢失、破损或短少的，本公司按照投保金额和损失的比例赔偿，最高不超过托寄物的实际损失金额。</p>";
                        text += "<p>（3）	托寄物残值由本公司和寄件人双方协商处理；如折归寄件人，本公司在核定赔偿金额时将扣减残值。</p>";
                        text += "<p>5、	对于签单返还服务，若因本公司原因导致签收回单毁损、丢失的，本公司承担的责任仅限于免费提供一次签单返还服务作为赔偿。</p>";
                        text += "<p>6、	本契约条款未作约定的，或本契约条款与国家相关法律法规及标准相冲突的，按照相关规定执行。</p>";
                    var box = page.dom("div","box").html(text);
                    confirm = page.dom("a","confirm").attr("href","javascript:void(0)").text("同意").on("click",function(){
                        domFix.addClass("hide");
                        callback();
                    });
                $("body").append(domFix.append(mask, content.append(close, box, confirm)));
            }
            domFix.removeClass("hide");
        },
    	// 字数限制输入计数
    	inputCount : function(inputBox, msgBox, length, callback){
    	    var cpLock = false;
    	    $("body").on("compositionstart", inputBox, function() {
    	        cpLock = true;
    	    });
    	    $("body").on("compositionend", inputBox, function() {
    	        cpLock = false;
    	    });
    	    $("body").delegate(inputBox, "input", function() {
    	        if (!cpLock) {
    	            var inputLength = inputBox.val().length;
    	            var showEvaContent = "";
    	            if (inputLength > length) {
    	            	showEvaContent = inputBox.val();
    	                inputBox.val(showEvaContent);
    	            } else {
    					inputBox.val(inputBox.val().replace(/\s{2}/," ").replace(/^\s/,"").replace(/\s$/,""));
    	                msgBox.text(inputLength + "/" + length);
                        if(inputLength >= length){
                            msgBox.addClass("red");
                        }else{
                            msgBox.removeClass("red");
                        }
    	            }
    	            callback(inputLength);
    	        }
    	    });
    	},
        inputCountNew:function(inputBox, msgBox, length, callback){
        	inputBox.on("input",function(){
        		var len = $(this).val().length;
        		if(len >= length){
        			msgBox.addClass("red");
        		}else{
        			msgBox.removeClass("red");
        		}
        		msgBox.text(len+"/" + length);
				callback(len);
        	}).on("focus",function(){
        		$(this).parent().removeClass("bg-red").addClass("bg-white");
        	}).on("blur",function(){
				if($(this).val().length==0){
					$(this).parent().removeClass("bg-red").removeClass("bg-white");
				}else{
					$(this).parent().addClass("bg-red").removeClass("bg-white");
				}
				callback($(this).val().length);
        	});
        },
        // 可编辑DIV，获得焦点，并使焦点定位到文本最后
        divFocusEnd : function(obj) {
            return;
            // obj.focus();
            if (obj.createTextRange) {//ie
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            } else if (obj.selectionStart) {//chrome "<input>"、"<textarea>"
                obj.selectionStart = obj.value.length;
            } else if (window.getSelection) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                tempRange.setStart(obj[0].firstChild, obj[0].firstChild.length);
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }


        },
        /**
         * 用于解决安卓和苹果上按钮被顶到输入框上面
         * btn:为按钮。如$(".confirm-single-btn")
         */
        footerbtn:function(btn){
        	  // 表单获取焦点的时候
		      $("input").focus(function(){
				  if(!page.versions.android){
					  btn.addClass("hide");
				  }
		      }).blur(function(){//表单失去焦点的时候
				  if(!page.versions.android){
					  btn.removeClass("hide");
				  }
		      });
		      if(page.versions.android){
		    	  window.onresize = function(){
			          var vhk = document.documentElement.clientHeight;
			          if(vhk < vh){
			        	  btn.addClass("hide");
					  }else{
						  btn.removeClass("hide");
					  }
		    	  }
		      }else{
		    	  btn.removeClass("hide");
		      }
        },
         /**
         * 用于二维码展示页面底部兼容问题
         */
         footScan:function(){
            if(page.versions.android){
                $(".scan-show footer.scan-word ul li").css("padding-bottom",".8rem");
            }
         },
        /**
         * 弹出样式
         * 尽快安排快递员上门
         * tit: 标题
         * info: 填充内容
         */
//  <div class="dialog-pickup-fromexce">
//     <div class="mask fixed-100"></div>
//     <div class="content center-middle animated">
//         <p class="suc-word">我们已经收到您的要求会尽快安排快递员上门</p>
//         <p class="door-time">预计上门时间:<span>10月24日18:00</span></p>
//         <a href="javascript:void(0);" class="success-butt">我知道了</a>
//     </div>
// </div>
    	shade:function(tit,info){
			var dialogFor=$(".dialog-pickup-fromexce");
			if(dialogFor.length < 1){
				dialogFor = page.dom("div","dialog-pickup-fromexce");
                dialog=page.dom("div","mask fixed-100");
                confor=page.dom("div","content center-middle animated");
                var noticeWord=page.dom("p","suc-word").text(tit),
                    timeDoor=page.dom("p","door-time").text(info),
                    btnSure=page.dom("a","success-butt").text("我知道了");
                $("body").append(dialogFor.append(dialog,confor.append(noticeWord,timeDoor,btnSure)));
				 // de = page.dom("div","fault animated success-box littleDiv");
				 // var noticeWord=page.dom("p","suc-word").text(tit),
					//  timeDoor=page.dom("div","door-time").text(info),
					//  btnSure=page.dom("a","success-butt").text("我知道了");
					//  $("body").append(sha);
					//  $("body").append(de.append(noticeWord,timeDoor,btnSure));
			}

			dialogFor.find(".success-butt").on("click",function(){
				dialogFor.remove();
			})
            dialogFor.find(".mask").on("click",function(){
				dialogFor.remove();
			})
    	},

        // <!-- 抱歉弹窗 -->
  // <div class="all-total fixed-100">
  // <div  class="big-wrap fixed-100">
  //       </div>
  //       <div class="lit-mask center-middle">
  //           <div class="img-mark"></div>
  //               <p class="sorry-word">抱歉！</p>
 // <p class="con-word-ad">由于您选择的寄件地址未参与<br>新版顺丰速运公众号试点，无法完成下单。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;建议您通过以下方式完成下单：</p>
  //             <p class="call-word">拨打客服电话95338</p>
   //            <p class="con-word-tips">给您造成的不便，请见谅</p>
  //               <a href="javascript:void(0);" class="mask-btn" >我知道了</a>
  //   </div>
  //   <div>
  // sour 弹框类型， "bj" => 保价超过20000提示
        sorryshow:function(tit,info,sour){
            var dialogFor=$(".sorryshow-box");
            if(dialogFor.length < 1){
                dialogFor = page.dom("div","all-total sorryshow-box fixed-100 hide").on("touchmove",function(e){e.preventDefault()});
                var dialog=page.dom("div","big-wrap fixed-100"),
                    confor=page.dom("div","lit-mask center-middle"),
                    maskBtn=page.dom("a","mask-btn").text("我知道了").attr("href","javascript:void(0)");
                if (sour && sour == "bj") {
                    // 保价超过20000提示
                  //  if (sour != "bj") return;
                    var ensureWord=page.dom("p","en-sure-word").html(info),
                        imgMark=page.dom("div","img-en-mark");
                        $("body").append(dialogFor.append(dialog,confor.append(imgMark,ensureWord,maskBtn)));
                }else if(sour && sour=="custom"){

                        var imgMark=page.dom("div","img-mark"),
                            sorryWord=page.dom("p","sorry-word").text(tit),
                            conWordadd=page.dom("p","con-word-ad").html(info),
                            conwordTips=page.dom("p","con-word-tips").text("");

                        $("body").append(dialogFor.append(dialog,confor.append(imgMark,sorryWord,conWordadd,conwordTips,maskBtn)));

                }else {
                    var imgMark=page.dom("div","img-mark"),
                        sorryWord=page.dom("p","sorry-word").text(tit),
                        conWordadd=page.dom("p","con-word-ad").html(info),
                        callWord=page.dom("p","call-word").html("<a href=\"tel:95338\">拨打客服电话95338</a><span>或</span><a href=\"javascript:void(0)\">使用顺丰速运APP</a>"),
                        conwordTips=page.dom("p","con-word-tips").text("给您造成的不便，请见谅");
                    $("body").append(dialogFor.append(dialog,confor.append(imgMark,sorryWord,conWordadd,callWord,conwordTips,maskBtn)));
                }
            }
            dialogFor.removeClass("hide");
            dialogFor.find(".mask-btn").on("click",function(){
                dialogFor.remove();
            });
            dialogFor.find(".big-wrap").on("click",function(){
                dialogFor.remove();
            });
        },
        /**
         * 派件偏好设置非试点网点抱歉提示框
         */
        sorryshowPreference:function(tit,info,sour){
            var dialogFor=$(".preference-box");
            if(dialogFor.length < 1){
                dialogFor = page.dom("div","all-total preference-box fixed-100 hide").on("touchmove",function(e){e.preventDefault()});
                var dialog=page.dom("div","big-wrap fixed-100"),
                    confor=page.dom("div","lit-mask center-middle"),
                    maskBtn=page.dom("a","mask-btn").text("我知道了").attr("href","javascript:void(0)");
                if (sour && sour == "bj") {
                    // 保价超过20000提示
                 //   if (sour != "bj") return;
                    var ensureWord=page.dom("p","en-sure-word").html(info),
                        imgMark=page.dom("div","img-en-mark");
                        $("body").append(dialogFor.append(dialog,confor.append(imgMark,ensureWord,maskBtn)));
                }else if(sour && sour=="custom"){

                    var imgMark=page.dom("div","img-mark"),
                        sorryWord=page.dom("p","sorry-word").text(tit),
                        conWordadd=page.dom("p","con-word-ad").html(info),
                        conwordTips=page.dom("p","con-word-tips").text("");
                    $("body").append(dialogFor.append(dialog,confor.append(imgMark,sorryWord,conWordadd,conwordTips,maskBtn)));

                 } else {
                    var imgMark=page.dom("div","img-mark"),
                        sorryWord=page.dom("p","sorry-word").text(tit),
                        conWordadd=page.dom("p","con-word-ad").html(info),
                      //  callWord=page.dom("p","call-word").html("<a href=\"tel:95338\">拨打客服电话95338</a><span>或</span><a href=\"javascript:void(0)\">使用顺丰速运APP</a>"),
                        conwordTips=page.dom("p","con-word-tips").text("给您造成的不便，请见谅");
                    $("body").append(dialogFor.append(dialog,confor.append(imgMark,sorryWord,conWordadd,conwordTips,maskBtn)));
                }
            }
            dialogFor.removeClass("hide");
            dialogFor.find(".mask-btn").on("click",function(){
                dialogFor.remove();
            });
            dialogFor.find(".big-wrap").on("click",function(){
                dialogFor.remove();
            });
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
    },
};

    // 页面相关
    var page = {
    dom : function(domName, className) {
        return $("<" + domName + ">").addClass(className);
    },
    setStorage : function(k, v) {
        return sessionStorage.setItem(k, v);
    },
	removeStorage : function(k) {
        return  sessionStorage.removeItem(k);
    },
    getStorage : function(k) {
        return sessionStorage.getItem(k);
    },
    /**
    * ---解析url对应的参数----
    * @author 847789
    * @time 2016年08月02日
    * @param name 参数名（key）
    * @returns 返回参数名下的参数值 （value） 否则返回 false
    */
    getUrlParm : function (key){
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
    isInArray : function(arr, val){
       var i, iLen;
       if(!(arr instanceof Array) || arr.length === 0){
           return false;
       }
       if(typeof Array.prototype.indexOf === 'function'){
           return !!~arr.indexOf(val)
       }
       for(i = 0, iLen = arr.length; i < iLen; i++){
           if(val === arr[i]){
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

    	versions:function(){
           var u = navigator.userAgent, app = navigator.appVersion;
           return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
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

    var order = {
    _doEvent : function(e){
        e.preventDefault();
    },
    handler:function(actionid){
        switch (actionid) {
            case 1:{
                //alert("remove touchmove event");
                document.removeEventListener("touchmove",this._doEvent,false);
            }break;
            default:{
                //alert("add touchmove event");
                document.addEventListener("touchmove", this._doEvent, false);
            }break;
        }
    },
    sendingWay : "pickup", // 寄件方式：pickup、store、fcbox

	/*
    * 底部滑动选择
	*date: 2016-09-08
	*author: 847789
	* _tit: 标题
	* _row: 类型  single单列展示滑动，double双列展示滑动
	* _col: 项数，数字3/5
	*_list1: 滚动左边列表1，
	*_list2: 滚动有右边列表2，单列传入null
	*val1: 解决左边数据自动定位问题。单列需要定位可传入参数。参数需与list1中的某个参数一致，如：list1中的某个参数为：广东省，val1：也为广东省
	*va2: 解决右边数据自动定位问题。单列可传空
	*callback: 回调
    举个栗子：
        var a = ["今天","明天","后天","后天1","后天2","后天3","后天4","后天5","后天6","后天7"];
        var b = {
			init : ["a1","a2","a3","a4"],
			returnList : function(index){
				var list = [];
				if(index == 0){
					list = ["a1","a2","a3","a4"];
				} else if (index == 1) {
					list = ["b1","b2","b3","b4","b5","b6","b7"];
				} else if (index == 2) {
					list = ["c1","c2","c3","c4","c5","c6"];
				}
				return list;
			}
		};
        order.selector("城市选择","single",a,b,function(v1,v2){
        	alert(v1+","+v2);
        });
	*/
	selectorOld : function(_tit, _row, _col, _list1, _list2, callback, val1, val2, val3) {
       if(arguments.length == 1 && arguments[0] == "close"){
           closeFix();
           return;
       }

		var proviceIndex=0,cityIndex=0,countyIndex=0;
		$(".select-roll.fixed-100").remove();
       var empty = "<li class='swiper-slide'></li>";
       function createFix(){
   		var b = page.dom("div","select-roll fixed-100 " + _row),
           mask=page.dom("div","fixed-100 mask"),
           wrap=page.dom("div","wrap"),
   		meta = page.dom("section","meta"),
   		t = page.dom("h2","title").text(_tit),
   		close = page.dom("a","close ico-cls").attr("href", "javascript:void(0)").on("click", function() {
   			closeFix();
   		}),
   		btn = page.dom("button","confirm").text("确定");
   		var content = page.dom("div","content" + (_col == 5 ? " five" : "") );
			if (_row == "single") {
				var container = page.dom("div","swiper-container"),
	    		wrapper = page.dom("ul","swiper-wrapper");
				for (var i = 0; i < _list1.length; i++) {
					(function(j) {
						if(val1){
							if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
								proviceIndex = j;
							}
						}
						var slide = page.dom("li","swiper-slide").text(_list1[j]);
						wrapper.append(slide);
					})(i);
				}
				b.append(wrap.append(meta.append(t, close), content.append(container.append(wrapper)), btn),mask);
			} else if (_row == "double") {
				var container1 = page.dom("div","swiper-container selclass1"),
					container2 = page.dom("div","swiper-container selclass2"),
					wrapper1 = page.dom("ul","swiper-wrapper"),
   				wrapper2 = page.dom("ul","swiper-wrapper");
				for (var i = 0; i < _list1.length; i++) {
					(function(j) {
						if(val1){
							if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
								proviceIndex = j;
							}
						}
						var slide1 = page.dom("li","swiper-slide").text(_list1[j]);
						wrapper1.append(slide1);
					})(i);
				}
				for (var k = 0; k < _list2.init.length; k++) {
					(function(m) {
						var slide2 = $("<li>").addClass("swiper-slide").text(_list2.init[m]);
						wrapper2.append(slide2);
					})(k);
				}
   			b.append(wrap.append(meta.append(t, close), content.append(container1.append(wrapper1)),content.append(container2.append(wrapper2)), btn),mask);
			 $("body").addClass("addboht");
            $("html").addClass("addboht");
        } else if (_row == "triple") {
            var container1 = page.dom("div","swiper-container selclass1"),
                container2 = page.dom("div","swiper-container selclass2"),
                container3 = page.dom("div","swiper-container selclass3"),
                wrapper1 = page.dom("ul","swiper-wrapper"),
                wrapper2 = page.dom("ul","swiper-wrapper"),
                wrapper3 = page.dom("ul","swiper-wrapper");
            for (var i = 0; i < _list1.length; i++) {
                (function(j) {
                    if(val1){
                        if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
                            proviceIndex = j;
                        }
                    }
                    var slide1 = page.dom("li","swiper-slide").text(_list1[j]);
                    wrapper1.append(slide1);
                })(i);
            }
            for (var k = 0; k < _list2.init.length; k++) {
                (function(m) {
                    var slide2 = $("<li>").addClass("swiper-slide").text(_list2.init[m]);
                    wrapper2.append(slide2);
                })(k);
            }
            for (var m = 0; m < _list2.list3.init.length; m++) {
                (function(n) {
                    var slide3 = $("<li>").addClass("swiper-slide").text(_list2.list3.init[n]);
                    wrapper3.append(slide3);
                })(m);
            }
            b.append(wrap.append(meta.append(t, close), content.append(container1.append(wrapper1)),content.append(container2.append(wrapper2)),content.append(container3.append(wrapper3)), btn),mask);

        }

           $("body").append(b);
           order.handler(0);
           return b;
       }
       var b = createFix();
       function closeFix(){
           b = b || $(".select-roll");
           b.remove();
           order.handler(1);
            $("body").removeClass("addboht");
           $("html").removeClass("addboht");
       }
       var swiperConfig = {
           slidesPerView: 3,
           direction: "vertical",
           iOSEdgeSwipeDetection : true,
           iOSEdgeSwipeThreshold : 50
	   };

     var swiperConfigLeft = {
          slidesPerView: 3,
          direction: "vertical",
          onTransitionEnd: function(swiper){
              if (_row == "triple") {
                  cityIndex = 0;
                  countyIndex = 0;
              }
              bllist2(swiper);
          }
      };
      var swiperConfigCenter = {
           slidesPerView: 3,
           direction: "vertical",
           onTransitionEnd: function(swiper){
               if (_row == "triple") countyIndex = 0;
               bllist3(swiper.activeIndex || 0);
           }
       };
      if(_col == 5){
          swiperConfig.slidesPerView = 5;
          swiperConfigLeft.slidesPerView = 5;
          swiperConfigCenter.slidesPerView = 5;
          swiperConfig.centeredSlides = true;
          swiperConfigLeft.centeredSlides = true;
          swiperConfigCenter.centeredSlides = true;
      }

       function bllist2(swiper){
           //s2.removeAllSlides();
			var b = _list2.returnList(0);
			if(swiper.activeIndex){
				var b = _list2.returnList(swiper.activeIndex);
			}
			s2.removeAllSlides();
			for (var k = 0; k < b.length; k++) {
				(function(m) {
					if(val2){
						if(val2.indexOf(b[m])!=-1 || b[m].indexOf(val2)!=-1){
							cityIndex = m;
						}
					}
					var slide2 = page.dom("li","swiper-slide").text(b[m]);
					s2.appendSlide(slide2);
				})(k);
			}
			if(_col != 5){
				s2.appendSlide([ empty, empty ]);
			}
			s2.update();
           var index = swiper.activeIndex || 0;
			// if(val2){
			// 	if(_list1[index].indexOf(val1)!=-1 || val1.indexOf(_list1[index])!=-1){
					s2.slideTo(cityIndex, 200, false);
			// 	}
			// }
          if (_row == "triple") bllist3(cityIndex || 0);

       }
       function bllist3(swiperIndex){
           //s2.removeAllSlides();
			var b = _list2.list3.returnList(swiperIndex);
			s3.removeAllSlides();
			for (var k = 0; k < b.length; k++) {
				(function(m) {
					if(val3){
						if(val3.indexOf(b[m])!=-1 || b[m].indexOf(val3)!=-1){
							countyIndex = m;
						}
					}
					var slide3 = page.dom("li","swiper-slide").text(b[m]);
					s3.appendSlide(slide3);
				})(k);
			}
			if(_col != 5){
				s3.appendSlide([ empty, empty ]);
			}
			s3.update();
			s3.slideTo(countyIndex, 200, false);

       }
		if (_row == "single") {
		    var singleSwiper = new Swiper(".swiper-container", swiperConfig);
           if(_col != 5){
				singleSwiper.appendSlide([empty, empty]);
           }
		} else if (_row == "double") {
			var s2 = new Swiper(".swiper-container.selclass2", swiperConfig),
               s1 = new Swiper(".swiper-container.selclass1", swiperConfigLeft);
			if(_col != 5){
				s1.appendSlide([empty, empty]);
				s2.appendSlide([empty, empty]);
			}
			if(val1){
				s1.slideTo(proviceIndex, 150, true);
			}
			bllist2(swiper);

       } else if (_row == "triple") {
			var s3 = new Swiper(".swiper-container.selclass3", swiperConfig),
               s2 = new Swiper(".swiper-container.selclass2", swiperConfigCenter),
               s1 = new Swiper(".swiper-container.selclass1", swiperConfigLeft);
			if(_col != 5){
				s1.appendSlide([empty, empty]);
				s2.appendSlide([empty, empty]);
				s3.appendSlide([empty, empty]);
			}

			if(val1){
				s1.slideTo(proviceIndex, 150, true);
			}
           bllist2(swiper);


       }
		b.find(".confirm").on("click",function(){
			if (_row == "single") {
				callback(_list1[singleSwiper.activeIndex]);
			} else if (_row == "double") {
              $("body").removeClass("addboht");
             $("html").removeClass("addboht");
				var r1 = _list1[s1.activeIndex],
					r2 = _list2.returnList(s1.activeIndex)[s2.activeIndex];
				callback(r1,r2);
			} else if (_row == "triple") {
              $("body").removeClass("addboht");
             $("html").removeClass("addboht");
				var r1 = _list1[s1.activeIndex],
					r2 = _list2.returnList(s1.activeIndex)[s2.activeIndex],
   				r3 = _list2.list3.returnList(s2.activeIndex)[s3.activeIndex];
				callback(r1,r2,r3);
			}
			closeFix();
		});

	},
    selector : function(_tit, _row, _col, _list1, _list2, callback, val1, val2, val3, hotCitylist) {
        if(arguments.length == 1 && arguments[0] == "close"){
            closeFix();
            return;
        }
        //选择的热门城市
        var selecthotCity='',selecthotProvince='';
		var proviceIndex=0,cityIndex=0,countyIndex=0;
		$(".select-roll.fixed-100").remove();
        var empty = "<li class='swiper-slide'></li>";
        function createFix(){
    		var b = page.dom("div","select-roll fixed-100 " + _row),
            mask=page.dom("div","fixed-100 mask"),
            wrap=page.dom("div","wrap"),
    		meta = page.dom("section","meta"),
    		t = page.dom("h2","title").text(_tit),
    		close = page.dom("a","close ico-cls").attr("href", "javascript:void(0)").on("click", function() {
    			closeFix();
    		}),

    		btn = page.dom("button","confirm").text("确定");

    		//热门城市新增DOM
    		var hotlistcontent = page.dom("ul","hot-list"),
    		    sectionTitle = page.dom("section","meta-two"),
    		    title = page.dom("h2","title").text("省市区选择");

    		var content = page.dom("div","content" + (_col == 5 ? " five" : "") );
			if (_row == "single") {
				var container = page.dom("div","swiper-container"),
	    		wrapper = page.dom("ul","swiper-wrapper");
				for (var i = 0; i < _list1.length; i++) {
					(function(j) {
						if(val1){
							if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
								proviceIndex = j;
							}
						}
						var slide = page.dom("li","swiper-slide").text(_list1[j]);
						wrapper.append(slide);
					})(i);
				}
				b.append(wrap.append(meta.append(t, close), content.append(container.append(wrapper)), btn),mask);
			} else if (_row == "double") {
				var container1 = page.dom("div","swiper-container selclass1"),
					container2 = page.dom("div","swiper-container selclass2"),
					wrapper1 = page.dom("ul","swiper-wrapper"),
    				wrapper2 = page.dom("ul","swiper-wrapper");
				for (var i = 0; i < _list1.length; i++) {
					(function(j) {
						if(val1){
							if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
								proviceIndex = j;
							}
						}
						var slide1 = page.dom("li","swiper-slide").text(_list1[j]);
						wrapper1.append(slide1);
					})(i);
				}
				for (var k = 0; k < _list2.init.length; k++) {
					(function(m) {
						var slide2 = $("<li>").addClass("swiper-slide").text(_list2.init[m]);
						wrapper2.append(slide2);
					})(k);
				}
    			b.append(wrap.append(meta.append(t, close), content.append(container1.append(wrapper1)),content.append(container2.append(wrapper2)), btn),mask);
			 $("body").addClass("addboht");
             $("html").addClass("addboht");
         } else if (_row == "triple") {
             var container1 = page.dom("div","swiper-container selclass1"),
                 container2 = page.dom("div","swiper-container selclass2"),
                 container3 = page.dom("div","swiper-container selclass3"),
                 wrapper1 = page.dom("ul","swiper-wrapper"),
                 wrapper2 = page.dom("ul","swiper-wrapper"),
                 wrapper3 = page.dom("ul","swiper-wrapper");
             for (var i = 0; i < _list1.length; i++) {
                 (function(j) {
                     if(val1){
                         if(val1.indexOf(_list1[j])!=-1 || _list1[j].indexOf(val1)!=-1){
                             proviceIndex = j;
                         }
                     }
                     var slide1 = page.dom("li","swiper-slide").text(_list1[j]);
                     wrapper1.append(slide1);
                 })(i);
             }
             for (var k = 0; k < _list2.init.length; k++) {
                 (function(m) {
                     var slide2 = $("<li>").addClass("swiper-slide").text(_list2.init[m]);
                     wrapper2.append(slide2);
                 })(k);
             }
             for (var m = 0; m < _list2.list3.init.length; m++) {
                 (function(n) {
                     var slide3 = $("<li>").addClass("swiper-slide").text(_list2.list3.init[n]);
                     wrapper3.append(slide3);
                 })(m);
             }
             //组装热门城市DOMlist
             if(hotCitylist && hotCitylist.length>0){
            	 for(var n=0;n<hotCitylist.length;n++){
                	 var li = "<li hotcity='"+hotCitylist[n].fullName+"' hotprovince='"+hotCitylist[n].fullNamep+"'>"+hotCitylist[n].fullName+"</li>";
                	 hotlistcontent.append(li);
                 }
            	//为城市选择绑定
                 hotlistcontent.find('li').on('click',function(){
                	 if($(this).hasClass('clicked')){
                		 $(this).removeClass('clicked');

                         if(val1){
                        	 for(var l=0;l<_list1.length;l++){
                        		 if(val1.indexOf(_list1[l])!=-1 || _list1[l].indexOf(val1)!=-1){
                        			    if(selecthotProvince.indexOf(val1)!=-1 || val1.indexOf(selecthotProvince)!=-1){
                        			    	 selecthotCity="";
                                             selecthotProvince="";
                        			    	s1.slideTo(l, 150, true);
                        			    	bllist2(s1);
                        			    }else{
                        			    	 selecthotCity="";
                                             selecthotProvince="";
                        			    	s1.slideTo(l, 150, true);
                        			    }
                        	            break;
                                 }
                             }
                         }else{
						    selecthotCity="";
                            selecthotProvince="";
						 }


                		 return;
                	 }

                	 $(this).addClass('clicked').siblings().removeClass('clicked');
                	 //处理省
                	 var hotprovince = $(this).attr("hotprovince");
                	 var hotcity = $(this).attr("hotcity");
                	 if(hotprovince && hotcity ){
                		 for(var i = 0; i < _list1.length; i++){
                			 if(hotprovince.indexOf(_list1[i])!=-1 || _list1[i].indexOf(hotprovince)!=-1){
                               //  s1.slideTo(i, 150, true);
                                 if (_row == "triple") {
                                     cityIndex = 0;
                                     countyIndex = 0;
                                 }
                                 var activeli =  $('div.swiper-container.selclass1 ul.swiper-wrapper').find('li')[s1.activeIndex];
                                 var activeprovince =  $(activeli).text();
                                 if(activeprovince.indexOf(hotprovince)!=-1 || hotprovince.indexOf(activeprovince)!=-1){
                                	 selecthotCity=hotcity;
                                     selecthotProvince=hotprovince;
                                     s1.slideTo(i, 150, true);
                                 	 bllist2(s1);//防止热门城市同一个省份不触发swiperConfigLeft.onTransitionEnd
                                 }else{
                                	 selecthotCity=hotcity;
                                     selecthotProvince=hotprovince;
                                     s1.slideTo(i, 150, true);
                                 }

                                 return;
                             }

                		 }

                     }
                 });

                  b.append(wrap.append(meta.append(t, close),hotlistcontent,sectionTitle.append(title),content.append(container1.append(wrapper1)),content.append(container2.append(wrapper2)),content.append(container3.append(wrapper3)), btn),mask);

             }else{
                  b.append(wrap.append(meta.append(t, close), content.append(container1.append(wrapper1)),content.append(container2.append(wrapper2)),content.append(container3.append(wrapper3)), btn),mask);

             }
             $("body").addClass("addboht");
             $("html").addClass("addboht");
         }

            $("body").append(b);
            order.handler(0);
            return b;
        }
        var b = createFix();
        function closeFix(){
            b = b || $(".select-roll");
            b.remove();
            order.handler(1);
             $("body").removeClass("addboht");
            $("html").removeClass("addboht");
        }
        var swiperConfig = {
            slidesPerView: 3,
            direction: "vertical",
            iOSEdgeSwipeDetection : true,
            iOSEdgeSwipeThreshold : 50
	   };

      var swiperConfigLeft = {
           slidesPerView: 3,
           direction: "vertical",
           onTransitionEnd: function(swiper){
               if (_row == "triple") {
                   cityIndex = 0;
                   countyIndex = 0;
               }
               bllist2(swiper);
           }
       };
       var swiperConfigCenter = {
            slidesPerView: 3,
            direction: "vertical",
            onTransitionEnd: function(swiper){
                if (_row == "triple") countyIndex = 0;
                bllist3(swiper.activeIndex || 0);
            }
        };
       if(_col == 5){
           swiperConfig.slidesPerView = 5;
           swiperConfigLeft.slidesPerView = 5;
           swiperConfigCenter.slidesPerView = 5;
           swiperConfig.centeredSlides = true;
           swiperConfigLeft.centeredSlides = true;
           swiperConfigCenter.centeredSlides = true;
       }

        function bllist2(swiper){
            //s2.removeAllSlides();
			var b = _list2.returnList(0);
			if(swiper.activeIndex){
				var b = _list2.returnList(swiper.activeIndex);
			}
			s2.removeAllSlides();
			for (var k = 0; k < b.length; k++) {
				(function(m) {
					var compare = '';
					if(selecthotCity && selecthotCity!=''){
						compare = selecthotCity;
						//判断如果滚动的省份不是热门城市的省，则清除热门城市的选择
						if(selecthotProvince.indexOf(_list1[swiper.activeIndex])==-1 && _list1[swiper.activeIndex].indexOf(selecthotProvince)==-1){
							selecthotCity = '';
							selecthotProvince = '';
							compare = val2;

							$('ul.hot-list').find('li.clicked').removeClass('clicked');
						}

					}else{
						compare = val2;
					}
					if(compare){
						if(compare.indexOf(b[m])!=-1 || b[m].indexOf(compare)!=-1){
							console.log("bllist2 cityIndex = m:"+m);
							cityIndex = m;
						}
					}
					var slide2 = page.dom("li","swiper-slide").text(b[m]);
					s2.appendSlide(slide2);
				})(k);
			}
			if(_col != 5){
				s2.appendSlide([ empty, empty ]);
			}
			s2.update();
            var index = swiper.activeIndex || 0;
			s2.slideTo(cityIndex, 200, false);
			console.log("bllist2 cityIndex:"+cityIndex);

           if (_row == "triple") bllist3(cityIndex || 0);

        }
        function bllist3(swiperIndex){
            //s2.removeAllSlides();
			var b = _list2.list3.returnList(swiperIndex);
			s3.removeAllSlides();

			if(selecthotCity && selecthotCity!=''){

				var liarray = $('div.swiper-container.selclass2 ul.swiper-wrapper').find('li')[swiperIndex];
				var activecity = $(liarray).text();
				console.log('activecity:'+activecity);
				//判断如果滚动的市不是选择的热门城市的市，则清除热门城市的选择
				if(selecthotCity.indexOf(activecity)==-1 && activecity.indexOf(selecthotCity)==-1){
					selecthotCity = '';
					selecthotProvince = '';
					$('ul.hot-list').find('li.clicked').removeClass('clicked');
				}

			}
			//若果滚动的城市是热门城市中的一个，则高亮此热门城市
			if(hotCitylist && hotCitylist.length>0){
				var liarray = $('div.swiper-container.selclass2 ul.swiper-wrapper').find('li')[swiperIndex];
				var activecity = $(liarray).text();

				for(var i=0;i<hotCitylist.length;i++){//.provincename
					if(activecity.indexOf(hotCitylist[i].fullName)!=-1 || hotCitylist[i].fullName.indexOf(activecity)!=-1){
						selecthotCity = hotCitylist[i].fullName;
						selecthotProvince = hotCitylist[i].fullNamep;
						$('ul.hot-list').find("li[hotcity='"+hotCitylist[i].fullName+"']").addClass('clicked').siblings().removeClass('clicked');
						break;
					}
				}

			}

			for (var k = 0; k < b.length; k++) {
				(function(m) {
					if(val3){
						if(val3.indexOf(b[m])!=-1 || b[m].indexOf(val3)!=-1){
							countyIndex = m;
						}
					}
					var slide3 = page.dom("li","swiper-slide").text(b[m]);
					s3.appendSlide(slide3);
				})(k);
			}
			if(_col != 5){
				s3.appendSlide([ empty, empty ]);
			}
			s3.update();
			s3.slideTo(countyIndex, 200, false);

        }
		if (_row == "single") {
		    var singleSwiper = new Swiper(".swiper-container", swiperConfig);
            if(_col != 5){
				singleSwiper.appendSlide([empty, empty]);
            }
		} else if (_row == "double") {
			var s2 = new Swiper(".swiper-container.selclass2", swiperConfig),
                s1 = new Swiper(".swiper-container.selclass1", swiperConfigLeft);
			if(_col != 5){
				s1.appendSlide([empty, empty]);
				s2.appendSlide([empty, empty]);
			}
			if(val1){
				s1.slideTo(proviceIndex, 150, true);
			}
			bllist2(swiper);

        } else if (_row == "triple") {
			var s3 = new Swiper(".swiper-container.selclass3", swiperConfig),
                s2 = new Swiper(".swiper-container.selclass2", swiperConfigCenter),
                s1 = new Swiper(".swiper-container.selclass1", swiperConfigLeft);
			if(_col != 5){
				s1.appendSlide([empty, empty]);
				s2.appendSlide([empty, empty]);
				s3.appendSlide([empty, empty]);
			}

			if(val1 && (val1.indexOf(_list1[0]) ==-1 && _list1[0].indexOf(val1) ==-1 )){
				s1.slideTo(proviceIndex, 150, true);
			}else{
				bllist2(s1);
			}


        }
		b.find(".confirm").on("click",function(){
			if (_row == "single") {
				callback(_list1[singleSwiper.activeIndex]);
			} else if (_row == "double") {
               $("body").removeClass("addboht");
              $("html").removeClass("addboht");
				var r1 = _list1[s1.activeIndex],
					r2 = _list2.returnList(s1.activeIndex)[s2.activeIndex];
				callback(r1,r2);
			} else if (_row == "triple") {
               $("body").removeClass("addboht");
              $("html").removeClass("addboht");
				var r1 = _list1[s1.activeIndex],
					r2 = _list2.returnList(s1.activeIndex)[s2.activeIndex],
    				r3 = _list2.list3.returnList(s2.activeIndex)[s3.activeIndex];
				callback(r1,r2,r3);
			}
			closeFix();
		});

	},
    // 春节期间运费+10
    CNYFee : function(type, now, fee){
        var startTM = new Date("2017/1/27 00:00:00"), // 20170127
            endTM = new Date("2017/2/3 00:00:00"); // 20170202
        if (type == "fee") {
            now = !now ? new Date() : now;
            fee = !fee ? 0 : parseInt(fee);
            if (now.getTime() >= startTM.getTime() && now.getTime() < endTM.getTime()) {
                return fee + 10;
            } else {
                return fee;
            }
        } else {
            $.ajax({
                type : "POST",
                url : "/cx-wechat-order/order/weixin/getNewDate",
                success : function (data) {
                    var now = new Date(data.replace(/-/g,"/"));
                    if (now.getTime() >= startTM.getTime() && now.getTime() < endTM.getTime()) {
                        return mutual.knowShade("alert","","您好，春节期间（除夕-初六）寄件需收取10元/票节假日服务费，祝春节愉快！","我知道了");
                    }
                }
            });
        }
    },
	cancel : function(appointmentNo, _pickupType, yesCallback, noCallback){
		// 取消订单（会员ID，预约请求号）
		// <div class="dialog-cancel-order fixed-100">
        //     <div class="mask fixed-100"></div>
        //     <div class="content center-middle">
        //         <h3 class="title">是否取消订单？</h3>
        //         <p class="btn">
        //             <a class="yes" href="javascript:void(0)">是</a>
        //             <a class="on no" href="javascript:void(0)">否</a>
        //         </p>
        //         <a class="others" href="javascript:void(0)">转换其他寄件方式</a>
        //         <!-- 点击转换其他寄件方式之后的流程是怎样的 -->
        //     </div>
        // </div>
        var o = {
            sysCode: "WEIXIN",  //系统名
            language: "zh",     //语言默认中文
            mediaCode : "weixin",	//媒体码
            countryCode : "CN",     //国家编码
            appointmentNo : appointmentNo,   //预约请求号
            operateType : 1,                     //操作 0催单 1消单 2补充消单原因
            pickupType : _pickupType, //消单请求方式  0.服务点自寄 1.上门收件 2.丰巢柜自寄3.前台寄件
            messageType:"4",//是		3.催收  4.取消预约
            cusReason : ""				   //消单原因
        };
        var ddArr = {};
        ddArr.jsonStr = JSON.stringify(o);
        mutual.dialogYN("是否取消订单？", function(){
            mutual.tipsLoading("正在取消");
            $.ajax({
                type : "POST",
                url : "/cx-wechat-order/order/weixin/adress/cancelOrder",
                data : ddArr,
                timeout:3000,
                dataType : "json",
                success : function (data) {
                    mutual.tipsLoading();
                    if(data.success){
                        yesCallback && yesCallback();
                        location.href = "../order/order-cancel.html?appointmentNo=" + appointmentNo;
                    }else{
                        if(data.errorCode=="APPOINTMENT_CANNOT_CANCEL"){
                          mutual.tipsDialog("该包裹已揽收或者取消，取消寄件失败");
                        }else{
                          mutual.tipsDialog(data.message);
                        }
                    }
                },
				error:function(XMLHttpRequest, textStatus, errorThrown){
                    mutual.tipsLoading();
					mutual.tipsDialog("请求服务器异常,请稍后再试！");
			  }
            });
        }, noCallback);
	}
}

    // 用户登陆相关
    var member = {
        dom : function(){
            // <!-- 登陆弹窗 -->
            // <div class="dialog-login-global fixed-100 hide">
            //     <div class="mask fixed-100"></div>
            //     <div class="tab center-middle">
            //         <ul class="container d-flex">
            //             <li class="current flex-1">验证码登录</li>
            //             <li class="flex-1">账号登录</li>
            //         </ul>
            //         <section class="sn-mode content">
            //             <div class="term d-flex">
            //                 <input class="mobile input flex-1" type="tel" placeholder="请输入手机号码">
            //             </div>
            //             <div class="term d-flex">
            //                 <input class="sn input flex-1" type="number" placeholder="请输入验证码">
            //                 <button class="getsn" type="button">发送验证码</button><!-- gray -->
            //             </div>
            //             <button class="btn" type="button">登录</button>
            //         </section>
            //         <section class="ac-mode content hide">
            //             <div class="term d-flex">
            //                 <input class="user input flex-1" type="tel" placeholder="请输入账号">
            //             </div>
            //             <div class="term d-flex">
            //                 <input class="password input flex-1" type="password" placeholder="请输入密码">
            //             </div>
            //             <button class="btn" type="button">登录</button>
            //         </section>
            //     </div>
            // </div>
            var dialogLogin = $(".dialog-login-global");
            if(dialogLogin.length < 1){
                var dialogLogin = page.dom("div","dialog-login-global fixed-100 hide").on("touchmove",function(e){e.preventDefault()}),
                    mask = page.dom("div","mask fixed-100").on("click",function(){
                        dialogLogin.addClass("hide");
                    }),
                    tab = page.dom("div","tab center-middle"),
                    container = page.dom("ul","container d-flex"),
                    li1 = page.dom("li","current flex-1").text("验证码登录"),
                    li2 = page.dom("li","flex-1").text("账号登录"),
                    contentSN = page.dom("section","sn-mode content"),
                    term1 = page.dom("div","term d-flex"),
                    mobile = page.dom("input","mobile input flex-1").attr("type","tel").attr("placeholder","请输入手机号码"),
                    term2 = page.dom("div","term d-flex"),
                    sn = page.dom("input","sn input flex-1").attr("type","number").attr("placeholder","请输入验证码"),
                    getsn = page.dom("button","getsn").attr("type","button").text("发送验证码"),
                    sbSN = page.dom("button","btn").attr("type","button").text("登录"),
                    contentAC = page.dom("section","ac-mode content hide"),
                    term3 = page.dom("div","term d-flex"),
                    user = page.dom("input","user input flex-1").attr("type","tel").attr("placeholder","请输入账号"),
                    term4 = page.dom("div","term d-flex"),
                    password = page.dom("input","password input flex-1").attr("type","password").attr("placeholder","请输入密码"),
                    sbAC = page.dom("button","btn").attr("type","button").text("登录");
                $("body").append(dialogLogin.append(mask, tab.append(container.append(li1, li2), contentSN.append(term1.append(mobile), term2.append(sn, getsn), sbSN), contentAC.append(term3.append(user), term4.append(password), sbAC))));
                mutual.tab(dialogLogin.find(".tab"));
            }

            dialogLogin.removeClass("hide");

            return {
                dialog : dialogLogin,
                mobile : dialogLogin.find(".sn-mode .mobile"),
                sn : dialogLogin.find(".sn-mode .sn"),
                getsn : dialogLogin.find(".sn-mode .getsn"),
                sbSN : dialogLogin.find(".sn-mode .btn"),

                user : dialogLogin.find(".ac-mode .user"),
                pw : dialogLogin.find(".ac-mode .password"),
                sbAC : dialogLogin.find(".ac-mode .btn")
            };
        },
        isLogin : function(callback){
            // 判断是否绑定
            require(["login"],function(LOG){
                LOG.LOGIN.isBind(function (isBind){
                    callback(isBind.result == "true");
                });
            });
        },
        loging : function(callback){
            require(["login"],function(LOG){
                // 未绑定
                var ele = member.dom();
                // 获取验证码
                ele.getsn.on("click",function(){
                    if(LOG.LOGIN.sendCodeFlag){
                        LOG.API.sendSN(ele.mobile.val(), $(this));
                    }
                });
                // 验证码登陆方式---登陆按钮
                ele.sbSN.on("click",function(){
                    var mobile = ele.mobile.val();
                    var sn = ele.sn.val();

                    LOG.LOGIN.processLogin(mobile, sn, false,function(){
                        isLogin = true;
                        page.setStorage("memberIsLogin","1");
                        ele.dialog.addClass("hide");
                        callback(isLogin);
                    });
                });
                // 账号登陆方式---登陆按钮
                ele.sbAC.on("click", function() {
                    var mobile = ele.user.val();
                    var code = ele.pw.val();
                    code = encrypt(code);
                    LOG.LOGIN.processLogin(mobile, code, true, function(){
                        isLogin = true;
                        page.setStorage("memberIsLogin","1");
                        ele.dialog.addClass("hide");
                        callback(isLogin);
                    });
                });
            });
        }
    };

    /**
     * 微信用户对象
     */
    var WeixinUser = {

        /**
         * 会员对象
         */
        MemberObj: {
            memberNo: false,
            mobile: false,
            birthday: false,
            portrait: false
        },

        /**
         * TODO 获取用户名与用户电话
         * @Author 80001108
         * @Time 2016/11/11 14:35:59
         * @ajaxParamObj {async, successCallFn, failCallFn}
         * @return string, string
         */
        getUserNameAndMob: function(asyncFlag, successFn, failFn) {
            $.ajax({
                type : "POST",
                async: asyncFlag,
                dataType : "json",
                url : "/service/weixin/getUserNameAndMobile",
                success: function(response){
                    successFn.call(this, response);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    failFn.apply(this, arguments);
                }
            });
        },

        /**
         * TODO 获取用户登录的BaseInfo
         * @Author 80001108
         * @Time 2016/11/11 14:38:59
         * @return
         */
        getUserBaseInfo: function (asyncFlag, successFn, failFn) {
            $.ajax({
                type : "POST",
                dataType : "json",
                async: asyncFlag,
                url : "/service/weixin/getUserBaseInfo",
                success: function(response){
                    successFn.call(this, response);
                },
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    failFn.apply(this, arguments);
                }
            });
        },

        /**
         * TODO 获取用户会员号与会员电话号码
         * @Author 80001108
         * @Time 2016/11/11 14:43:59
         */
        getMemNoAndMobile: function(asyncFlag, successFn, failFn) {
            $.ajax({
                type : "POST",
                dataType : "json",
                async: asyncFlag,
                url : "/service/weixin/getMemNoAndMobile",
                success: function(response){
                    successFn.call(this, response);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown){
                    failFn.apply(this, arguments);
                }
            });
        },

        /**
         * TODO 将会员与微信公众号解绑
         * @Author 80001108
         * @Time 2016/11/11 14:45:59
         */
        membUnbindWechat: function (asyncFlag, memberObj, successFn, failFn, completeFn) {
            var mm = {
                mobile: memberObj.mobile,
                userName: memberObj.userName
            };
            var url = "/service/weixin/wxMemUnBindSimp";
            $.ajax({
                type : "POST",
                data : mm,
                dataType : "json",
                async: asyncFlag,
                url : url,
                success : function(response) {
                    successFn.call(this, response);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    failFn.apply(this, arguments);
                },
                complete:function(XMLHttpRequest, textStatus){
                    if (typeof completeFn === 'function') {
                        completeFn.apply(this, arguments);
                    }
                }
            });
        },

        /**
         * TODO 通过会员号(memNo)获取会员信息【包含会员生日信息……】
         * @Author 80001108
         * @Time 2016/11/11 14:43:59
         */
        getMemDefaultBirth: function (memNo, asyncFlag, successFn, failFn) {
            $.ajax({
                type:'post',
                dataType:'json',
                async: asyncFlag,
                url:'/service/weixin/getUserinfo?memNo='+memNo,
                success:function(data){
                    successFn.call(this, data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    failFn.apply(this, arguments);
                }
            })
        }
    };

// 扫一扫
var WeixinAPI={
        /**
		 * 微信API接口配置
		 * @author 80001078
		 *@time 2016年09月1日 下午15:20:03
         *先初始化 ：WeixinAPI.setConfig();
		 */
		setConfig : function(jsApiList){
            var jsWxApiList = [];
            if (!jsApiList) {
                jsWxApiList.push('scanQRCode');
            } else {
                if (Array.isArray(jsApiList)) {
                    jsWxApiList = jsApiList;
                } else if (typeof jsApiList === 'string') {
                    var arr = jsApiList.split(',');
                    for (var i in arr) {
                        jsWxApiList.push(arr[i]);
                    }
                } else {
                    console.error('没有待配置的JS-API方法。');
                    return;
                }
            }
			var url = window.location.href;
			var mm={};
			mm.url=url;
			$.ajax({
				type:"get",
				dataType:"json",
				data:mm,
				cache: false,
				url:"/service/weixin/querySignService",
				success:function (wxConfig){
					jWeixin.config({
					    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    appId: wxConfig.appId, // 必填，公众号的唯一标识
					    timestamp: wxConfig.timestamp, // 必填，生成签名的时间戳
					    nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
					    signature: wxConfig.signature,// 必填，签名，见附录1
					    jsApiList: jsWxApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
				},
				error: function (XMLHttpRequest, textStatus, errorThrown){

				}
			});
		},
		/**
		 * 微信二维码扫描接口
		 * @author 80001078
		 * @time 2016年09月1日 下午15:24:03
		 * @param successCallback 成功回调方法
		 * @needResultParam　默认为0，扫描结果由微信处理，1则直接返回扫描结果
		 */
		scanQRCode : function(successCallback,needResultParam){
			jWeixin.ready(function(){
				jWeixin.scanQRCode({
				    needResult: needResultParam, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				    success: function (res) {
				    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				    	if(typeof successCallback === "function"){
							//返回扫描结果　
						 	successCallback(result);
						  }
						}
				});
			});
		 }
}


	return {
		mutual : mutual,
		page : page,
		order : order,
        login : member,
		WeixinAPI : WeixinAPI,
        WeixinUser: WeixinUser
	};
});
