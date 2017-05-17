angular.module("customerapp",[]).controller("customerManageCtrl", ['$scope', function ($scope) {
    $scope.operation = $("#operationType").val();
    $scope.cusName = "";
    $scope.cusPhone = "";
    $scope.cusAddr = "";
    $scope.cusAddrDetail = "";
    //$scope.SaveAddress = function () {
    //    processc.valiDateAddress();
    //};
    $scope.MoreAddr = function () {
        el.getMoreAddress();
    }
    
    var pagination = {
        condition: "",
        currentPage: 1,
        pageCount: 10
    };
    var el = {
        isBtnDoflg: false,//按钮是否可用
        username: $("#userName"),
        tel: $("#tel"),
        cusAddr: $("#city-picker3"),
        address: $("#address"),
        operation: $("#hdoperationType"),
        user_map: new Map(),
        btnSubmit: $("#saveBtn"),
        btnClear: $("#emptyInputBtn"),
        btnSaveAddr: $("#isSaveAddrBtn"),
        addressList: $("#addresslistid"),
        uniqueId:$("#hduniqueId"),
        hdaddr: $("#hdaddr"),
        addForm:$(".add-form"),
        init: function () {//初始化页面
            mutual.tipsLoading("数据加载中...");
            
            if (el.operation.val() == "edit" || el.operation.val() == "create") {
                el.btnSaveAddr.addClass("hide");
                el.btnClear.addClass("hide");
                el.addForm.removeClass("sending");
                el.addForm.removeClass("receiving");
                el.hideList("addresslistid");
                mutual.tipsLoading();
            } else {
                
                var _jsonStr = {
                    condition: pagination.condition,
                    pageNo: pagination.currentPage,
                    rowCount: pagination.pageCount
                };
                $.post("/CustomerManage/QueryAddress", _jsonStr, function (data) {
                    mutual.tipsLoading();
                    if (data.status) {
                        var list = data.result;
                        if (list == 0) {
                            el.hideList("addresslistid");
                            return;
                        }
                        var conrbn = [];
                        conrbn.push('<dt>历史地址</dt>');
                        for (var i = 0; i < list.length; i++) {
                            el.user_map.put(list[i].UniqueId, list[i]);
                        
                            conrbn.push('<dd class="bg" data-addressId="' + list[i].UniqueId + '">');
                            conrbn.push('<span class="name">' + list[i].Csr_Name + '</span>');
                            conrbn.push('<span class="tel">' + list[i].Csr_Tel + '</span>');
                            var address = list[i].Csr_AddrDetail.replace(/\_\_/g, "");
                            var addressinfo = list[i].Csr_Addr + address;

                            conrbn.push('<p class="address">' + addressinfo + '</p>');
                            conrbn.push('</dd>');
                        }
                        conrbn.push('<a href="javascript:void(0)" class="coin-more">进入地址簿,查看更多&nbsp;&nbsp;&gt;&gt;</a>');
                        $("#addresslistid").html(conrbn.join(""));
                        el.showList("addresslistid");
                        $(".coin-more").on('click', function () {
                            el.getMoreAddress();
                        });
                    }
                });
            }
            
            el.bindClick();
            el.isBtnDo();
            mutual.footerbtn(el.btnSubmit);
            
            var customerType = $("#hdcustomerType").val();
            var addrInfo = JSON.parse(page.getStorage(customerType + "addressBookItem"));
            if (addrInfo != null && el.operation.val() != "create") {
                el.cusAddr.val(addrInfo.Csr_Addr).change();
                el.address.val(addrInfo.Csr_AddrDetail);
                el.username.val(addrInfo.Csr_Name);
                el.tel.val(addrInfo.Csr_Tel);
                el.uniqueId.val(addrInfo.UniqueId);
            } else {
                //初始化地址
                if (el.hdaddr.val() == "")
                    el.cusAddr.val("河南省/漯河市/源汇区").change();
                else
                    el.cusAddr.val(el.hdaddr.val()).change();
            }
            //var province = tools.splitString(el.cusAddr.val(), '/', 0);
            //var city = tools.splitString(el.cusAddr.val(), '/', 1);
            //var district = tools.splitString(el.cusAddr.val(), '/', 2);
            //$.each($(".select-item"), function (i, c) {
            //    var type = $(c).data('count');
            //    if (type == "province")
            //        $(c).text(province);
            //    else if (type == "city")
            //        $(c).text(city);
            //    else if (type == "district")
            //        $(c).text(district);
            //});
        },
        bindClick: function () {//页面事件绑定
            el.btnClear.on("click", function () {
                if (!$(this).hasClass("on")) {
                    return;
                }
                $(".add-form").find("input").val("");
                el.isBtnDo();
                el.initAddressList();
                el.showList("addresslistid");
            });
            el.btnSaveAddr.on('click', function () {
                $(this).toggleClass("on");
            });
            el.addressList.on("click", "dd", function () {// 模糊根据用户名匹配
                $(".confirm-single-btn").removeClass("hide");
                var addrId = $(this).attr("data-addressId");
                var obj = el.user_map.get(addrId);
                // 填充至input框中
                el.initData(obj);
                // 隐藏
                el.hideList("addresslistid");
                el.isBtnDo();
            });
            el.btnSubmit.on('click', function () {
                processc.valiDateAddress();
            })
        },
        initData: function (obj) {//初始化页面控件数据
            if (!obj) {
                return;
            }
            el.cusAddr.val(obj.Csr_Addr).change();
            el.address.val(obj.Csr_AddrDetail);
            el.username.val(obj.Csr_Name);
            el.tel.val(obj.Csr_Tel);
            el.uniqueId.val(obj.UniqueId);
        },
        initAddressList: function () {
            if (!el.user_map.isEmpty()) {
                el.hideList("addresslistid");
                var list = el.user_map;
                var conrbn = [];
                conrbn.push('<dt>历史地址</dt>');
                for (var i = 0; i < el.user_map.size() ; i++) {
                    var obj = el.user_map.arr[i].value;
                    conrbn.push('<dd class="bg" data-addressId="' + obj.UniqueId + '">');
                    conrbn.push('<span class="name">' + obj.Csr_Name + '</span>');
                    conrbn.push('<span class="tel">' + obj.Csr_Tel + '</span>');
                    var address = obj.Csr_AddrDetail.replace(/\_\_/g, "");
                    var addressinfo = obj.Csr_Addr + address;

                    conrbn.push('<p class="address">' + addressinfo + '</p>');
                    conrbn.push('</dd>');
                }
                conrbn.push('<a href="javascript:void(0)" class="coin-more">进入地址簿,查看更多&nbsp;&nbsp;&gt;&gt;</a>');
                $("#addresslistid").html(conrbn.join(""));
                $(".coin-more").on('click', function () {
                    el.getMoreAddress();
                });
            }
        },
        getMoreAddress: function () {
            var customerType = $("#hdcustomerType").val();
            window.location.href = "/CustomerManage/Index?type=" + customerType;
        },
        isBtnDo: function () {//按钮是否可用
            $("input").each(function () {
                if ($(this).val() != "" && $(this).attr("id") != el.cusAddr.attr("id")) {//fillin.isBtnDoflg true :按钮为可用    false  按钮为不可用
                    el.isBtnDoflg = true;
                    return false;
                } else {
                    el.isBtnDoflg = false;
                }
            });
            if (!el.isBtnDoflg && el.address.text() != "") {//input全部为空的时候检查地址是不是为空
                el.isBtnDoflg = true;
            }
            if (el.isBtnDoflg) {
                el.btnClear.addClass("on");
                el.btnSubmit.removeClass("gray").addClass("active");
            } else {
                el.btnClear.removeClass("on");
                el.btnSubmit.removeClass("active").addClass("gray");
            }
        },
        hideList: function (_id) {// 隐藏列表的时候，显示确认按钮
            $("#" + _id).empty();
            $("#" + _id).addClass("hide");
        },
        showList: function (_id) {// 显示列表的时候，隐藏确认按钮
            $("#" + _id).removeClass("hide");
        }
    };

    var processc = {//业务处理
        valiDateAddress: function () {//验证保存地址信息
            var _name = el.username.val().replace(/^\s*|\s*$/g, "");
            el.username.val(_name);
            var _contactPhone = "";
            var submitStatus = true; // 提交状态
            var errorInfo = "";// 无法成功提交时缺少的字段
            if (_name == "") {
                mutual.tipsDialog("请填写姓名哦！");
                return;
            }
            if (el.tel.val() == "") {
                mutual.tipsDialog("请填写联系电话哦！");
                return;
            }
            
            if (el.cusAddr.val() == "") {
                mutual.tipsDialog("请选择省市区信息哦！");
                return;
            }
            var province = tools.splitString(el.cusAddr.val(),'/',0);
            if (!province.status || province.returnValue == "")
            {
                mutual.tipsDialog("请选择正确的所属省信息哦！");
                return;
            }
            var city = tools.splitString(el.cusAddr.val(), '/', 1);
            if (!city.status || city.returnValue == "") {
                mutual.tipsDialog("请选择正确的所属城市信息哦！");
                return;
            }
            var district = tools.splitString(el.cusAddr.val(), '/', 2);
            if (!district.status || district.returnValue == "") {
                mutual.tipsDialog("请选择正确的所属区信息哦！");
                return;
            }
            if (el.address.val() == "") {
                mutual.tipsDialog("请填写您的详细地址哦！");
                return;
            }
            if (check.getCEL(el.username.val()) > 20) {
                mutual.tipsDialog("姓名过长，请修改后提交！");
                return;
            }
            if (check.getCEL(el.tel.val().replace(/\-/g, "")) > 14) {
                mutual.tipsDialog("电话过长，请修改后提交！");
                return;
            }

            if (el.tel.val().indexOf("1") != 0) {// 座机
                {
                    check.subCEL(el.tel.val(), 14);
                    if (!check.isTel(el.tel.val())) {
                        mutual.tipsDialog("请输入正确是座机号码！");
                        return;
                    }
                }
            } else {
                check.subCEL(el.tel.val().replace(/\-/g, ""), 14);
                if (!check.isPhone(el.tel.val())) {
                    mutual.tipsDialog("请输入正确是手机号码！");
                    return;
                }
            }
            
            var addrinfo = province + city + district + address + "";
            if (check.getCEL(el.address.text()) > 100) {
                mutual.tipsDialog("地址过长，请修改后提交！");
                return;
            }
            mutual.tipsLoading("数据处理中...");
            var obj = {
                Csr_Addr: el.cusAddr.val(),
                Csr_AddrDetail: el.address.val(),
                Csr_Name: el.username.val(),
                Csr_Tel: el.tel.val(),
                UniqueId: el.uniqueId.val()
            }
            var customerType = $("#hdcustomerType").val();
            page.setStorage(customerType + "addressBookItem", JSON.stringify(obj)); // 更新储存
            if (el.btnSaveAddr.hasClass("on"))
            {
                //需要保存到数据库
                $.post("/CustomerManage/SubmitCustomer", { name: obj.Csr_Name, tel: obj.Csr_Tel, addr: obj.Csr_Addr, addr_detail: obj.Csr_AddrDetail, uniqueId: obj.UniqueId }, function (data) {
                    mutual.tipsLoading();
                    if(!data.status)
                    {
                        mutual.tipsDialog(data.errormessage);
                    } else {
                        var obj = {
                            Csr_Addr: el.cusAddr.val(),
                            Csr_AddrDetail: el.address.val(),
                            Csr_Name: el.username.val(),
                            Csr_Tel: el.tel.val(),
                            UniqueId: data.uniqueId
                        }
                        var customerType = $("#hdcustomerType").val();
                        page.setStorage(customerType + "addressBookItem", JSON.stringify(obj)); // 更新储存
                        //跳转到订单页面
                        window.location.href = "/OrderManage/Create";
                    }
                });
            } else {
                //不需要保存到数据库
                mutual.tipsLoading();
                window.location.href = "/OrderManage/Create";
            }
            
        }
    }
    $(function () { el.init(); })
    
}]);
