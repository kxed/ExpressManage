angular.module("orderapp", ['directives']).controller("orderManageCtrl", ['$scope', function ($scope) {
    var formInfo = {
        receivingAddress: page.getStorage("receivingaddressBookItem"),
        sendingAddress: page.getStorage("sendingaddressBookItem"),
        pickupTime: page.getStorage("pickupTime"),
        payway: page.getStorage("payway"),
        insurance: page.getStorage("insurance"),
        talk: page.getStorage("talk"),
        goods: page.getStorage("goods")
    };
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
            formFromTo.isBtnDo();
            formFromTo.bindEvent();
            formFromTo.initChoice();
        },
        initChoice: function () {
            $scope.pickuptime = getNowFormatDate();
            $scope.sendingaddr = "请输入寄件人地址";
            $scope.receivingaddr = "请输入收件人地址";
            $scope.pickupTime = page.getStorage("pickupTime");
            $("#makeTime").val($scope.pickupTime);
            $scope.payway = page.getStorage("payway");
            $scope.insurance = page.getStorage("insurance");
            $scope.remark = page.getStorage("talk");
            $scope.remark = $scope.remark == "null" ? "无" : $scope.remark;
            $scope.goods = page.getStorage("goods");
            if (formInfo.sendingAddress == null)
                return;
            var obj = JSON.parse(formInfo.sendingAddress);
            var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
            $scope.sendingaddr = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
            if (formInfo.receivingAddress == null)
                return;
            var obj = JSON.parse(formInfo.receivingAddress);
            var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
            $scope.receivingaddr = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
        },
        bindEvent: function () {

            //点击弹出其它寄件方式
            // cm.mutual.sendingWay( $(".page-title .title.click") );
            //弹出条款
            $("#selterms").on("click", function () {
                $("#termsModal").modal('show');
            });

            $("#selIdo").on("click", function () {
                $(".sending-agree").toggleClass("on");
            });
            $("#btnAgree").on("click", function () { $(".sending-agree").toggleClass("on"); })
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
        // 填充寄件人表单
        writeSending: function () {
            formFromTo.from.sendingFrom.find(".placeholder")[0].innerText = "请输入寄件人地址";
            if (formInfo.sendingAddress == null)
                return;
            var obj = JSON.parse(formInfo.sendingAddress);
            //formFromTo.from.sendingFrom.find(".placeholder").addClass("hide");
            //formFromTo.from.sendingFrom.find(".content").removeClass("hide");
            formFromTo.from.sendingFrom.find(".user").text(obj.Csr_Name);
            var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
            formFromTo.from.sendingFrom.find(".address").text(city + " " + obj.Csr_AddrDetail.replace(/\__/g, ""));
            formFromTo.from.sendingFrom.find(".placeholder")[0].innerText = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
        },
        // 填充收件人表单
        writeReceiving: function () {
            formFromTo.from.receivingFrom.find(".placeholder")[0].innerText = "请输入收件人地址";
            if (formInfo.receivingAddress == null)
                return;
            var obj = JSON.parse(formInfo.receivingAddress);
            //formFromTo.from.receivingFrom.find(".placeholder").addClass("hide");
            //formFromTo.from.receivingFrom.find(".content").removeClass("hide");
            formFromTo.from.receivingFrom.find(".user").text(obj.Csr_Name);
            var city = tools.splitString(obj.Csr_Addr, '/', 1).returnValue;
            formFromTo.from.receivingFrom.find(".address").text(city + " " + obj.Csr_AddrDetail.replace(/\__/g, ""));
            formFromTo.from.receivingFrom.find(".placeholder")[0].innerText = obj.Csr_Name + "    " + city + " " + obj.Csr_AddrDetail.replace(/\__/g, "");
        },
        isBtnDo: function () {
            formFromTo.btnSubmit.removeClass("active").addClass("hide").addClass("gray");
            if (formInfo.receivingAddress == null) {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if (formInfo.sendingAddress == null) {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if (formInfo.pickupTime == "") {
                formFromTo.isBtnDoflg = false;
                return;
            }
            if (formInfo.payway == "null") {
                formFromTo.isBtnDoflg = false;
                return;
            }
            //if (formInfo.insurance == "null") {
            //    formFromTo.isBtnDoflg = false;
            //    return;
            //}
            //if (formInfo.talk == "null") {
            //    formFromTo.isBtnDoflg = false;
            //    return;
            //}
            if (formInfo.goods == "null") {
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
    $scope.goods = "点我选择^o^";
    $scope.insurance = 0;
    if ($scope.payway == "" || $scope.payway == undefined)
        $scope.payway = "点我选择^o^";

    /*付款方式*/
    $scope.ChoicePayway = function () {
        var selectValue = $(".payway-class").find("span.on");
        if (selectValue.length > 0)
            $("#paywayContent").val($(selectValue)[0].innerText);
        else
            $("#paywayContent").val("");
        $scope.payway = $("#paywayContent").val();
        if ($scope.payway == "") {
            $scope.payway = "点我选择^o^";
            //设置存储到客户端
            page.setStorage("payway", null);
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
                goodstr += "|" + c.innerText;
        })
        if (goodstr == "" && standard == "") {
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
    //$(function () {
    //    formFromTo.init();
    //})
}]);
//.controller("paywayCtrl", ['$scope', 'paywayService', function ($scope, paywayService) {
//    $scope.ChoicePayway = function () {
//        var selectValue = $(".payway-class").find("span.on");
//        $("#paywayContent").val($(selectValue)[0].innerText);
//        $scope.payway = $("#paywayContent").val();
//        paywayService.payway = $scope.payway;
//    }
//    //$("#btnPayway").on("click", function () {
//    //    var selectValue = $(".payway-class").find("span.on");
//    //    $("#paywayContent").val($(selectValue)[0].innerText);
//    //    $scope.payway = $("#paywayContent").val();
//    //    paywayService.payway = $scope.payway;
//    //})
//}]).service("paywayService", [function () {
//    this.payway = "点我选择^o^";
//}]);
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