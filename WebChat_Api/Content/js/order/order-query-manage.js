
var listMap = new Map();
var pagination = {
    condition: "",
    currentPage: 1,
    pageCount: 10
};

EL = {
    tbOrders: $("#tbOrders"),
    tbBody: $("#tbody"),
    init: function (loading) {
        var _jsonStr = {
            condition: pagination.condition,
            pageNo: pagination.currentPage,
            rowCount: pagination.pageCount
        };
        $.post("/OrderManage/OrdersQuery", _jsonStr, function (data) {
            if (data.status) {
                EL.appendOrder(data,loading);
            } else {
                mutual.tipsDialog("加载失败");
            }
        });
    },
    appendOrder: function (obj, s) {
        //EL.tbBody.empty();
        var emptyHTML = $(".noresult");
        if (emptyHTML.length < 1) {
            emptyHTML = page.dom("div", "noresult").html("<i></i><p>没有搜索到符合条件的订单</p>");
            $("#tbOrders tbody").after(emptyHTML);
        }
        var orderCon = new Array();
        for (var i = 0; i < obj.result.length; i++) {
            orderobj = obj.result[i];
            listMap.put(orderobj.UniqueId, orderobj);

            var waybillNo = orderobj.WaybillNo;
            waybillNo = waybillNo != null ? waybillNo : "无";
            var timeStr = "";
            var time = "";
            var statusStr = "";
            if (orderobj.Status == 0) {
                timeStr = "预计取件";
                time = DateFormat.jsonDateFormatLong(orderobj.ExpectTime);
                statusStr = "待取件";
            }
            else if (orderobj.Status == -1) {
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
            orderCon.push("<tr>");
            orderCon.push("<td>" + orderobj.Csr_Name_J + "</td>");
            orderCon.push("<td>" + orderobj.Csr_Addr_J + "</td>");
            orderCon.push("<td>" + orderobj.Csr_AddrDetail_J + "</td>");
            orderCon.push("<td>" + orderobj.Csr_Name_S + "</td>");
            orderCon.push("<td>" + orderobj.Csr_Addr_S + "</td>");
            orderCon.push("<td>" + orderobj.Csr_AddrDetail_S + "</td>");
            orderCon.push("<td>" + orderobj.Goods + "</td>");
            orderCon.push("<td>" + waybillNo + "</td>");
            orderCon.push("<td>快递员</td>");
            orderCon.push("<td>支付状态</td>");
            orderCon.push("<td>"+statusStr+"</td>");
            orderCon.push("</tr>");
        }
        if (s == "input") {
            $("#tbOrders tbody").html(orderCon.join(""));
        } else {
            $("#tbOrders tbody").append(orderCon.join(""));
        }
    }
}
EL.init("loading");