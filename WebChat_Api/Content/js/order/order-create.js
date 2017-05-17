angular.module("orderapp", ['directives']).controller("orderManageCtrl", ['$scope', function ($scope) {
    
    var formFromTo = {
        isBtnDoflg: false,
        btnSubmit: $("#submitBtn"),
        from: {
            sendingFrom: $(".form-from-to .from"),
            receivingFrom: $(".form-from-to .to"),
            pickupFrom: $(".form-from-to .pickup-date")
        },
        init: function () {
            $("#termsModal").modal('hide');
            //formFromTo.writeSending();
            //formFromTo.writeReceiving();
            formFromTo.bindEvent();
            formFromTo.initChoice();
            formFromTo.isBtnDo();
        },
        initChoice: function () {
            $scope.pickuptime = getNowFormatDate();
            $scope.sendingaddr = "请输入寄件人地址";
            $scope.receivingaddr = "请输入收件人地址";
            $scope.insurance = 0;
            $scope.payway = "点我选择^o^";
            $scope.goods = "点我选择^o^";
            $scope.pickupTime = page.getStorage("pickupTime");
            //$("#makeTime").val($scope.pickupTime);
            $scope.payway = page.getStorage("payway");
            $scope.insurance = page.getStorage("insurance");
            $scope.remark = page.getStorage("talk");
            if ($scope.remark == "null" || $scope.remark == null)
                $scope.remark = "无";
            else
                $scope.remark = $scope.remark == "null" ? "无" : $scope.remark;
            $scope.goods = page.getStorage("goods");
            if ($scope.goods == "null" || $scope.goods == null)
                $scope.goods = "点我选择^o^";
            else
                $scope.goods = $scope.goods == "null" ? "点我选择^o^" : $scope.goods;
            if ($scope.payway == "null" || $scope.payway == null)
                $scope.payway = "点我选择^o^";
            else
                $scope.payway = $scope.payway == "null" ? "点我选择^o^" : $scope.payway;

            if ($scope.insurance == "null" || $scope.insurance == null)
                $scope.insurance = 0;
            else
                $scope.insurance = $scope.insurance == "null" ? 0 : $scope.insurance;
            if (page.getStorage("isAggree")=="true")
            {
                $(".sending-agree").addClass("on");
            }

            if (formInfo.sendingAddress != null)
            {
                var obj = JSON.parse(formInfo.sendingAddress);
                var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
                $scope.sendingaddr = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
            }
            
            if (formInfo.receivingAddress != null)
            {
                var obj = JSON.parse(formInfo.receivingAddress);
                var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
                $scope.receivingaddr = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
            };
        },
        bindEvent: function () {
            formFromTo.btnSubmit.on('click', function () {
                var receivingaddress = page.getStorage("receivingaddressBookItem");
                var sendingAddress = page.getStorage("sendingaddressBookItem");
                
                if ($scope.sendingaddr == "" || $scope.sendingaddr == null || $scope.sendingaddr == "请输入寄件人地址"
                    || sendingAddress == "null" || sendingAddress == null || sendingAddress=="") {
                    mutual.tipsDialog("请选择正确的寄件人地址");
                    return;
                }
                if ($scope.receivingaddr == "" || $scope.receivingaddr == null || $scope.receivingaddr == "请输入收件人地址"
                    || receivingaddress == "null" || receivingaddress == null || receivingaddress == "") {
                    mutual.tipsDialog("请选择正确的收件人地址");
                    return;
                }
                if ($scope.pickuptime == "" || $scope.pickuptime == "null" || $scope.pickuptime == null) {
                    mutual.tipsDialog("请选择正确的取件时间");
                    return;
                }
                if ($scope.payway == null || $scope.payway == "null" || $scope.payway == "点我选择^o^") {
                    mutual.tipsDialog("请选择付款方式");
                    return;
                }
                if ($scope.goods == null || $scope.goods == "null" || $scope.goods == "点我选择^o^") {
                    mutual.tipsDialog("请选择物品");
                    return;
                }
                if (page.getStorage("isAggree") == null || page.getStorage("isAggree") == "false") {
                    mutual.tipsDialog("请先同意快件运单契约条款");
                    return;
                }
                var _jsonStr = {
                    sendingAddress: sendingAddress,
                    receivingaddress: receivingaddress,
                    pickuptime: $scope.pickuptime,
                    payway: $scope.payway,
                    goods: $scope.goods,
                    insurance: $scope.insurance,
                    talk:$scope.remark
                };
                var s = JSON.stringify(_jsonStr);
                var order = {};
                order.jsonStr = s;
                mutual.tipsLoading("数据处理中...");
                $.post("/OrderManage/SubmitOrder", order, function (data) {
                    mutual.tipsLoading();
                    if (data.status) {
                        mutual.tipsDialog("订单创建成功");
                        console.log("订单创建成功");
                        
                        if (typeof WeixinJSBridge != "undefined")
                            WeixinJSBridge.call('closeWindow');
                    } else {
                        mutual.tipsDialog(data.errormessage);
                    }
                });
            });
            //点击弹出其它寄件方式
            // cm.mutual.sendingWay( $(".page-title .title.click") );
            //弹出条款
            $("#selterms").on("click", function () {
                $("#termsModal").modal('show');
            });

            $("#selIdo").on("click", function () {
                $(".sending-agree").toggleClass("on");
                if ($(".sending-agree").hasClass("on"))
                { page.setStorage("isAggree", true); }
                else { page.setStorage("isAggree", false); }
                formFromTo.isBtnDo();
            });
            $("#btnAgree").on("click", function () {
                $(".sending-agree").toggleClass("on"); if ($(".sending-agree").hasClass("on"))
                { page.setStorage("isAggree", true); }
                else { page.setStorage("isAggree", false); } formFromTo.isBtnDo();
            })
            $(".placeholder").on("click", function () {
                window.location.href = "/CustomerManage/CustomerOperation/?type=" + $(this).attr("type");
            })
            $("#makeTime").datetimepicker({
                onClose: function () {
                    page.setStorage("pickupTime", $("#makeTime").val())
                }
            });

            $(".adress-choice").on('click', 'a', function () {
                var type = "sending";
                if ($(this).parent().hasClass("from"))
                    type = "sending";
                else if ($(this).parent().hasClass("to"))
                    type = "receiving";
                window.location.href = "/CustomerManage/Index?type=" + type;
            })

            $(".priceconfim .content").on("click", function () {
                var $this = $(this);
                if ($this.hasClass('goods')) {
                    $("#packageModal").modal('show');
                } else if ($this.hasClass('insurance')) {
                    $("#insuranceModal").modal('show');
                } else if ($this.hasClass('payway')) {
                    $("#paywayModal").modal('show');
                } else if ($this.hasClass('remark')) {
                    $("#talkModal").modal('show');
                }
            });
            /*包裹选择*/
            $(".goods-class").find("span").on("click", function () {

                var len = $(".goods-class").find("span.on").length;
                if (len >= 3) {
                    $(".panel-body .tip-three").removeClass("hide");
                    var $this = $(this);
                    if ($this.hasClass("on")) {
                        $this.removeClass("on");
                        $(".panel-body .tip-three").addClass("hide");
                    }
                } else {
                    $(".panel-body .tip-three").addClass("hide");
                    $(this).toggleClass('on');
                    //var $this = $(this);
                    //if ($this.hasClass("on")) {
                    //    $this.removeClass("on");
                    //} else {
                    //    $this.addClass("on");
                    //}
                }
            });

            $(".goods-standard > li").on("click", function () {
                var $this = $(this);
                if ($this.hasClass("on")) {
                    $this.removeClass("on");
                    $this.find("span").removeClass("on");
                } else {
                    $(".goods-standard > li").removeClass("on");
                    $(".goods-standard > li > span").removeClass("on");
                    $this.addClass("on");
                    $this.find("span").addClass("on");
                }
            });

            /*付款方式选择*/
            $(".payway-class").find("span").on("click", function () {
                var $this = $(this);
                if ($this.hasClass("on")) {
                    $this.removeClass("on");
                } else {
                    $(".payway-class").find("span").removeClass("on");
                    $this.addClass("on");
                }
            });

            //$("#btnPayway").on("click", function () {
            //    var selectValue = $(".payway-class").find("span.on");
            //    //设置存储到客户端
            //    page.setStorage("payway", $(selectValue)[0].innerText);

            //    $("#paywayContent").val($(selectValue)[0].innerText);

            //})
            /*捎话*/
            $(".talk-one").find("span").on("click", function () {
                var talks = $(".talk-one").find("span.on");
                var len = talks.length;
                if (len >= 3) {
                    $(".tip-three").removeClass("hide");
                    var $this = $(this);
                    if ($this.hasClass("on")) {
                        $this.removeClass("on");
                        $(".tip-three").addClass("hide");
                    }
                } else {
                    $(".tip-three").addClass("hide");
                    $(this).toggleClass('on');
                    //var $this = $(this);
                    //if ($this.hasClass("on")) {
                    //    $this.removeClass("on");
                    //} else {
                    //    $this.addClass("on");
                    //}
                    talks = $(".talk-one").find("span.on");
                    $("#talkOneContent").val("");
                    $.each(talks, function (i, c) {
                        var oldValue = $("#talkOneContent").val();
                        if (oldValue == "" || oldValue == undefined)
                            $("#talkOneContent").val(c.innerText);
                        else
                            $("#talkOneContent").val(oldValue + "|" + c.innerText);
                    })
                    if ($("#talkOneContent").val() == "") {
                        //设置存储到客户端
                        page.setStorage("talk", null);
                    } else {
                        //设置存储到客户端
                        page.setStorage("talk", $("#talkOneContent").val());
                    }
                }

            });
        },
        isBtnDo: function () {
            formFromTo.btnSubmit.removeClass("active").addClass("hide").addClass("gray");
            if ($scope.pickuptime == "" || $scope.pickuptime == "null" || $scope.pickuptime == null) {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if ($scope.sendingaddr == "" || $scope.sendingaddr == "null" || $scope.sendingaddr == null) {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if ($scope.receivingaddr == "" || $scope.receivingaddr == "null" || $scope.receivingaddr == null) {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if ($scope.payway==null||$scope.payway == "null" || $scope.payway == "点我选择^o^") {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if ($scope.goods ==null|| $scope.goods == "null" || $scope.goods == "点我选择^o^") {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if (page.getStorage("isAggree")==null||page.getStorage("isAggree") == "false")
            {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if (!formFromTo.isBtnDoflg) {
                formFromTo.isBtnDoflg = true;
            }
            if (formFromTo.isBtnDoflg) {
                formFromTo.btnSubmit.removeClass("hide").removeClass("gray").addClass("active");
            } else {
                formFromTo.btnSubmit.removeClass("active").addClass("hide").addClass("gray");
            }
        }
    };
    
    /*付款方式*/
    $scope.ChoicePayway = function () {
        var selectValue = $(".payway-class").find("span.on");
        if (selectValue.length >0)
            $("#paywayContent").val($(selectValue)[0].innerText);
        else
            $("#paywayContent").val("");
        $scope.payway = $("#paywayContent").val();
        if ($scope.payway == "")
        {
            $scope.payway = "点我选择^o^";
            //设置存储到客户端
            page.setStorage("payway", "null");
        } else {
            //设置存储到客户端
            page.setStorage("payway", $scope.payway);
        }
        
        formFromTo.isBtnDo();
    }
    /*保价*/
    $scope.baoPrice = 0;
    $scope.changePrice = function () {
        var price = $scope.insurancePrice * 0.03;
        if (isNaN(price))
            $scope.insurance = 0;
        else if (price > 0 && price < 1)
            $scope.baoPrice = 1;
        else
            $scope.baoPrice = price;
    }
    $scope.InputInsurance = function () {
        var price = $(".insurance .price >p")[1].innerText;
        if (price == undefined)
            $scope.insurance = 0;
        else if (isNaN(price))
            $scope.insurance = 0;
        else if (price > 0 && price < 1)
            $scope.insurance = 1;
        else
            $scope.insurance = $scope.insurancePrice;
        //设置存储到客户端
        page.setStorage("insurance", $scope.insurance);
        formFromTo.isBtnDo();
    }
    /*捎话*/
    $scope.remark = "无";
    $scope.talkOneContent = "";
    $scope.talkContent = "";
    $scope.talkCount = "0/20";
    $scope.ChangeTalk = function () {
        $scope.talkCount = $scope.talkContent.length + "/20";
    }
    $scope.TalkClick = function () {
        $scope.talkOneContent = $("#talkOneContent").val();
        if ($scope.talkOneContent == "")
            $scope.remark = $scope.talkContent;
        else if ($scope.talkContent == "")
            $scope.remark = $scope.talkOneContent;
        else
            $scope.remark = $scope.talkOneContent + "@" + $scope.talkContent;

        if ($scope.talkOneContent == "" && $scope.talkContent == "") {
            $scope.remark = "无";
            //设置存储到客户端
            page.setStorage("talk", null);
        } else {
            //设置存储到客户端
            page.setStorage("talk", $scope.remark);
        }
        
        formFromTo.isBtnDo();
    }
    /*物品*/
    $scope.goodsCount = "0/20";
    $scope.ChioceGoods = function () {
        $scope.goodsCount = $scope.goodsChioce.length + "/20";
    }
    $scope.GoodsClick = function () {
        var standard = $($(".goods-standard > li.on")[0]).attr("data-no");
        standard = standard == undefined ? "" : standard;
        var goods = $(".goods-class").find("span.on");
        var standardstr = "";
       
        var goodstr = "";
        $.each(goods, function (i, c) {
            if (goodstr == "")
                goodstr = c.innerText;
            else
                goodstr +="|"+c.innerText;
        })
        if (goodstr=="" && standard=="")
        {
            $scope.goods = "点我选择^o^";
            page.setStorage("goods", null);
        } else {
            if (standard == "")
                $scope.goods = goodstr;
            else
                $scope.goods = goodstr + "@" + standard + "kg";
            //设置存储到客户端
            page.setStorage("goods", $scope.goods);
        }
        
        formFromTo.isBtnDo();
    }
    formFromTo.init();
    
}]);
var formInfo = {
    receivingAddress: page.getStorage("receivingaddressBookItem"),
    sendingAddress: page.getStorage("sendingaddressBookItem"),
    pickupTime: page.getStorage("pickupTime"),
    payway: page.getStorage("payway"),
    insurance: page.getStorage("insurance"),
    talk: page.getStorage("talk"),
    goods: page.getStorage("goods")
};
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