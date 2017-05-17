var listMap = new Map();
var pagination = {
    condition: "",
    currentPage: 1,
    pageCount: 10
};
var API = {
    addressBook: function (load) {
        mutual.tipsLoading("数据加载中...");
        
        var _jsonStr = {
            condition: pagination.condition || $(".form-main input").val(),
            pageNo: pagination.currentPage,
            rowCount: pagination.pageCount
        };
        $.post("/CustomerManage/QueryAddress", _jsonStr, function (data) {
            mutual.tipsLoading();
            if (data.status) {
                html.appendaddressBook(data, load);//地址簿列表显示
            }
        });
    },
    deleteAddressBook: function (addressId, _this) {
        //删除地址簿的某项
        mutual.knowShade("confirm", "", "确定要删除该地址吗？", "取消", "确定", function () {
            mutual.tipsLoading("删除中");
            var _jsonStr = {
                addressId: addressId,
                type: "0"
            };
            $.post("/CustomerManage/DeleteAddress", { uniqueId: addressId }, function (data) {
                mutual.tipsLoading();
                if (data.status) {
                    mutual.tipsDialog("删除成功");
                    $(".list").empty();
                    pagination.currentPage = 1;
                    pagination.pageCount = 10;
                    API.addressBook();
                } else {
                    mutual.tipsDialog(data.errormessage);
                }
            });
        });
    }
}
var html = {
    appendaddressBook: function (obj, s) {//地址簿列表显示
        var emptyHTML = $(".noresult");
        if (emptyHTML.length < 1) {
            emptyHTML = page.dom("div", "noresult").html("<i></i><p>没有搜索到符合条件的地址</p>");
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
        var addressCon = new Array();
        for (var i = 0; i < obj.result.length; i++) {
            listMap.put(obj.result[i].UniqueId, obj.result[i]);
            
            var address = obj.result[i].Csr_AddrDetail.replace(/\_\_/g, "");
            var detailAddress = obj.result[i].Csr_Addr + address;
            addressCon.push('<li class="swiper-container swiper-container-horizontal"   data-value=' + obj.result[i].UniqueId + ' >');
            addressCon.push('<div class="swiper-wrapper stage">');
            addressCon.push('<div class="swiper-slide con swiper-slide-active">');
            addressCon.push('<div class="men-word">');
            addressCon.push('<p class="user">' + obj.result[i].Csr_Name + '</p>');
            addressCon.push('<span class="tel">' + obj.result[i].Csr_Tel + '</span>');
            addressCon.push('<a class="swiper-slide f-edit edite-word" href="javascript:void(0)"  data-value=' + obj.result[i].UniqueId + '><span class="f-edit edite">编辑</span></a>');
            addressCon.push('</div>');
            addressCon.push('<p class="contact-addr">' + detailAddress + '</p>');
            addressCon.push('</div>');
            // modify表示红色状态 complaint表示灰色状态
            addressCon.push('<a class="swiper-slide f-delete btn modify" href="javascript:void(0)"  data-value=' + obj.result[i].UniqueId + '><span class="f-delete center-middle">删除</span></a>');
            addressCon.push('</div>');
            addressCon.push('</li>');
        }
        if (s == "input") {
            $(".list").html(addressCon.join(""));
        } else {
            $(".list").append(addressCon.join(""));
        }
        var swiper = new Swiper(".swiper-container", {
            pagination: ".swiper-pagination",
            slidesPerView: 'auto',
            paginationClickable: true,
        });
        PagePagination.getMorePage(obj.totalCount, pagination.pageCount, pagination.currentPage);
    }
}
var eventDefine = {
    addEvent: function () {
        $(".list").off("click").on("click", "li", function (e) {
            var addressId = $(this).attr("data-value");
            if (e.target.className.indexOf("f-delete") != -1) {//删除操作
                API.deleteAddressBook(addressId, $(this));
                return;
            } else if (e.target.className.indexOf("f-edit") != -1) {//编辑操作
                eventDefine.editAddressBook(addressId);
                return;
            }
            eventDefine.queryAddressBook(addressId);
        });
        $("#createBtn").on("click", function () {
            window.location.href = "/CustomerManage/CustomerOperation?type=" + $("#hdcustomerType").val() + "&uniqueId=create";
        });

        var searchInput = $(".form-main input");
        var searchValue = searchInput.val();


        var cpLock = false;
        function inputtingSearch() {
            if (!cpLock) {
                var isSpe = check.isSpecial(searchInput);
                if (!isSpe) return;
                var val = check.trim(searchInput.val());
                val = val.replace(/\s{1+}/g, "*");
                if (val == searchValue && val != "") return;
                searchValue = val;
                pagination.currentPage = 1;
                if (val) {
                    pagination.condition = val;
                } else {
                    pagination.condition = "";
                }
                pagination.currentPage = 1;
                pagination.pageCount = 10;
                $(".list").empty();
                if (val == "") {
                    setTimeout(function () {
                        API.addressBook("input");
                        return;
                    }, 300);
                } else {
                    API.addressBook("input");
                }
            }
        }
        $("body").on("compositionstart", searchInput, function () {
            cpLock = true;
            inputtingSearch();
        });
        $("body").on("compositionend", searchInput, function () {
            cpLock = false;
            inputtingSearch();
        });
        $("body").on("input", searchInput, function () {
            inputtingSearch();
        });

        searchInput.on("focus", function () {
            //addressbook_ctly.click_search_address();//用户点击搜索框埋点
            $("#createBtn").addClass("hide");
        }).on("blur", function () {
            $("#createBtn").removeClass("hide");
        });
    },
    //选中地址。返回原地址页
    queryAddressBook: function (addressId) {
        var obj = listMap.get(addressId);
        var customerType = $("#hdcustomerType").val();
        page.setStorage(customerType + "addressBookItem", JSON.stringify(obj)); // 更新储存
        window.location.href = "/OrderManage/Create";
    },
    //地址簿的某项编辑，调整至编辑界面
    editAddressBook: function (addressId) {
        var obj = listMap.get(addressId);
        var customerType = $("#hdcustomerType").val();
        page.setStorage(customerType+"addressBookItem", JSON.stringify(obj)); // 更新储存
        window.location.href = "/CustomerManage/CustomerOperation?type=" + $("#hdcustomerType").val() + "&uniqueId=" + addressId;
        //$.post("/CustomerManage/GetAddressRedirectBack",{customer:obj,type:customerType},function(data){
        //    if(data.status)
        //        window.location.href = "/OrderManage/Create";
        //    else
        //    {
        //        mutual.tipsDialog(data.errormessage);
        //    }
        //});
    },
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
            API.addressBook("loading");
        });
    }
};
API.addressBook("loading");
eventDefine.addEvent();
mutual.footerbtn($("#addBookBtn"));




