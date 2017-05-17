var listMap = new Map();
var pagination = {
    condition: "",
    currentPage: 1,
    pageCount: 10
};
var EL = {
    btnSubmitReason: $("#btnSubmitReason"),
    cancelReasonModal: $("#cancelReasonModal"),
    selectedOrderItemId: "",
    reasonItem: $(".reason"),
    cusReason: "",
    errorMsg: $(".tip-three"),
    init: function (load) {
        EL.cancelReasonModal.modal('hide');
        mutual.tipsLoading("数据加载中...");

        var _jsonStr = {
            condition: pagination.condition,
            pageNo: pagination.currentPage,
            rowCount: pagination.pageCount
        };
        $.post("/OrderManage/QueryOrderByWechatId", _jsonStr, function (data) {
            mutual.tipsLoading();
            if (data.status) {
                EL.appendOrder(data, load);//订单列表显示
            }
        });
    },
    appendOrder: function (obj, s) {
        var emptyHTML = $(".noresult");
        if (emptyHTML.length < 1) {
            emptyHTML = page.dom("div", "noresult").html("<i></i><p>没有搜索到符合条件的订单</p>");
            $(".list").after(emptyHTML);
        }
        if (obj.result.length == 0) {
            emptyHTML.removeClass("hide")
            $(".list").addClass("hide")
            return;
        } else {
            emptyHTML.addClass("hide")
            $(".list").removeClass("hide")
        }
        var orderCon = new Array();
        for (var i = 0; i < obj.result.length; i++) {
            listMap.put(obj.result[i].UniqueId, obj.result[i]);
            orderobj = obj.result[i];
            var waybillNo = orderobj.WaybillNo;
            waybillNo = waybillNo != null ? waybillNo : "无";
            var timeStr = "";
            var time = "";
            var statusStr = "";
            if (orderobj.Status == 0)
            {
                timeStr = "预计取件";
                time = DateFormat.jsonDateFormatLong(orderobj.ExpectTime);
                statusStr = "待取件";
            }
            else if (orderobj.Status == -1)
            {
                timeStr = "取消时间";
                time = DateFormat.jsonDateFormatLong(orderobj.CancelTime);
                statusStr = "已取消";
            }
            else if (orderobj.Status == 1) {
                timeStr = "取件时间";
                time = DateFormat.jsonDateFormatLong(orderobj.ReceiptTime);
                statusStr = "待付款";
            }
            else if (orderobj.Status == 2) {
                timeStr = "付款时间";
                time = DateFormat.jsonDateFormatLong(orderobj.ReceiptTime);
                statusStr = "已付款";
            }
            else if (orderobj.Status == 3) {
                timeStr = "付款时间";
                time = DateFormat.jsonDateFormatLong(orderobj.ReceiptTime);
                statusStr = "已付款";
            }
            var city_j = tools.splitString(orderobj.Csr_Addr_J, '/', 1);
            var city_s = tools.splitString(orderobj.Csr_Addr_S, '/', 1);
            orderCon.push('<li class="term swiper-container swiper-container-horizontal"   data-value=' + orderobj.UniqueId + ' >');
            orderCon.push('<div class="swiper-wrapper stage">');
            orderCon.push('<div class="swiper-slide con swiper-slide-active express-list">');
            orderCon.push('<p class="waybill-id">运单号：<span>' + waybillNo + '</span></p>');
            orderCon.push('<p class="date">' + timeStr + '：<span>' + time+ '</span></p>');
            orderCon.push('<ul class="from-to"><li class="from fromto"><span class="city">' + city_j.returnValue + '</span><span class="user">' + orderobj.Csr_Name_J + '</span></li><li class="status center-middle"><span class="text" data-appointmentstatue="7">' + statusStr + '</span></li><li class="to fromto"><span class="city">' + city_j.returnValue + '</span><span class="user">' + orderobj.Csr_Name_S + '</span></li></ul>');
            orderCon.push('</div>');
            // modify表示红色状态 complaint表示灰色状态
            if (orderobj.Status == 0) {
                orderCon.push('<a class="swiper-slide btn modify cancel swiper-slide-next" href="javascript:void(0)" data-value=' + orderobj.UniqueId + ' data-pickuptype="1" data-reinvoice=""><span class="cancel center-middle">取消预约</span></a>');
            }
            else if (orderobj.Status == 1) {
                orderCon.push('<a class="swiper-slide btn modify pay swiper-slide-next" href="javascript:void(0)" data-value=' + orderobj.UniqueId + ' data-pickuptype="1" data-reinvoice=""><span class="pay center-middle">立即付款</span></a>');
            }
            else if (orderobj.Status == -1) {
                orderCon.push('<a class="swiper-slide btn off swiper-slide-next" href="javascript:void(0)" data-value=' + orderobj.UniqueId + '><span class="center-middle">已取消</span></a>');
                orderCon.push('<a class="swiper-slide f-delete btn modify" href="javascript:void(0)"  data-value=' + orderobj.UniqueId + '><span class="f-delete center-middle">删除</span></a>');
            }
            orderCon.push('</div>');
            orderCon.push('</li>');
        }
        if (s == "input") {
            $(".list").html(orderCon.join(""));
        } else {
            $(".list").append(orderCon.join(""));
        }
        var swiper = new Swiper(".swiper-container", {
            pagination: ".swiper-pagination",
            slidesPerView: 'auto',
            paginationClickable: true,
        });
        PagePagination.getMorePage(obj.totalCount, pagination.pageCount, pagination.currentPage);
    },
    caneclOrder: function (orderId, _this) {
        //取消订单列表的某项
        mutual.knowShade("confirm", "", "确定要取消该预约吗？", "取消", "确定", function () {
            EL.cusReason = "";
            EL.cancelReasonModal.modal('show');
            EL.reasonItem.find("dd.selected").removeClass("selected");
            EL.errorMsg.addClass('hide');
        });
    },
    deleteOrder: function (orderId, _this) {
        //删除订单列表的某项
        mutual.knowShade("confirm", "", "确定要删除该订单吗？", "取消", "确定", function () {
            mutual.tipsLoading("删除中");
            $.post("/OrderManage/DeleteOrder", { uniqueId: addressId }, function (data) {
                mutual.tipsLoading();
                if (data.status) {
                    mutual.tipsDialog("删除成功");
                    $(".list").empty();
                    pagination.currentPage = 1;
                    pagination.pageCount = 10;
                    EL.init();
                } else {
                    mutual.tipsDialog(data.errormessage);
                }
            });
        });
    }
}
var eventDefine = {
    addEvent: function () {
        $(".list").off("click").on("click", "li", function (e) {
            var orderId = $(this).attr("data-value");
            selectedOrderItemId = orderId;
            if (e.target.className.indexOf("f-delete") != -1) {//删除操作
                EL.deleteOrder(orderId, $(this));
                return;
            } else if (e.target.className.indexOf("cancel") != -1) {//取消操作
                EL.caneclOrder(orderId,$(this));
                return;
            }//
            else if (e.target.className.indexOf("pay") != -1) {//付款操作
                mutual.tipsDialog("功能暂未开发，感谢您的支持！");
                return;
            }
            //eventDefine.queryAddressBook(addressId);
        });
        EL.btnSubmitReason.on("click", function () {
            var select = $(".page-cancel").find("dd.selected");
            if (EL.cusReason != "") {
                EL.cancelReasonModal.modal('hide');
                mutual.tipsLoading("取消中");
                $.post("/OrderManage/CancelOrder", { uniqueId: selectedOrderItemId, reason: EL.cusReason }, function (data) {
                    mutual.tipsLoading();
                    if (data.status) {
                        mutual.tipsDialog("取消成功");
                        $(".list").empty();
                        pagination.currentPage = 1;
                        pagination.pageCount = 10;
                        EL.init();
                    } else {
                        mutual.tipsDialog(data.errormessage);
                    }
                });
            } else {
                //mutual.tipsDialog("请选择取消原因");
                EL.errorMsg.removeClass('hide');
            }
        });
        EL.reasonItem.on('click', "dd", function () {
            EL.errorMsg.addClass('hide');
            $(this).addClass("selected").siblings("dd").removeClass("selected");
            EL.cusReason = $(this).text();
        });
    },
    //选中订单，进入订单详情页
    queryAddressBook: function (addressId) {
        var obj = listMap.get(addressId);
        //功能暂未实现
    }
}
/**
 * 显示分页加载更多
 */
var PagePagination = {
    getMorePage: function (sendTotal, pageRows, currentPageNo) {
        if (Number(sendTotal) / Number(pageRows) > Number(currentPageNo)) {
            pagination.currentPage = Number(currentPageNo) + 1;
            $('.list').append(page.dom("li").append(page.dom("a", "load-more-tips").attr("href", "javascript:void(0)").text("加载更多")));
        }
        $('a.load-more-tips').off("click").on("click", function () {
            $(".load-more-tips").text("正在加载中").addClass("load-loading");
            $(".load-more-tips").remove();
            EL.init("loading");
        });
    }
};
EL.init("loading");
eventDefine.addEvent();