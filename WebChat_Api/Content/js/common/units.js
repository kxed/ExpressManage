// 工具类JS

//define(["common"],function(COM){

//时间格式化
var DateFormat = {
    jsonDateFormatLong: function (jsonDate) {
        try {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            var milliseconds = date.getMilliseconds();
            if (date.getFullYear() > 1900) {
                return date.getFullYear() + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds;
            } else {
                return "";
            }
        } catch (ex) {
            return "";
        }
    },
    jsonDateFormatyyyyMMdd: function (jsonDate) {
        try {
            var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            if (date.getFullYear() > 1900) {
                return date.getFullYear() + "年" + month + "月" + day + "日";
            } else {
                return "";
            }
        } catch (ex) {
            return "";
        }
    },
    //json日期格式转换为正常格式
    DateFormatyyyyMMdd: function (jsonDate) {
        var tempStrs = jsonDate.split(" ");
        var dateStrs = tempStrs[0].split("-");
        if (dateStrs[0].toString().indexOf('/') > 0) {
            dateStrs = tempStrs[0].split("/")
        }
        var year = parseInt(dateStrs[0], 10);
        var month = parseInt(dateStrs[1], 10);
        var day = parseInt(dateStrs[2], 10);

        return year + "年" + month + "月" + day + "日";
    },
    // 根据日期时间转文字天数。
    //_nowtime：为当前日期时间毫秒数；
    //_time:为需要转文字日期的日期；
    dateToDay: function (_time) {
        var date = _time;
        var _nowtime = DateFormat.formatDateTime(new Date(), "yyyy-MM-dd");
        //if(COM.page.versions.iPhone || COM.page.versions.iPad || COM.page.versions.ios){
        //	_time = _time.toString().replace(/-/g,"/");
        //}
        if (page.versions.iPhone || page.versions.iPad || page.versions.ios) {
            _time = _time.toString().replace(/-/g, "/");
        }
        _time = DateFormat.formatDateTime(new Date(_time), "yyyy-MM-dd");
        _nowtime = (new Date(_nowtime)).getTime();
        _time = (new Date(_time)).getTime();
        var t = _time - _nowtime;
        var day_qty = parseInt(t / (1000 * 60 * 60 * 24));

        var dayStr = date.substring(8, date.indexOf(" ")) + "日";
        if (day_qty == 2) {
            dayStr = "后天";
        } else if (day_qty == 1) {
            dayStr = "明天";
        } else if (day_qty == 0) {
            dayStr = "今天";
        }
        return dayStr;
    },
    // 根据文字天数转日期。
    //_day：为今天，明天，后天；
    DayTodate: function (_day) {
        var paddNum = function (num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        var day_qty = 0;
        if (_day == "明天") {
            day_qty = 1;
        } else if (_day == "后天") {
            day_qty = 2;
        }
        var now = new Date();
        var years = paddNum(now.getFullYear());
        var months = paddNum(now.getMonth() + 1);
        var days = paddNum(now.getDate() + day_qty);


        return years + "-" + months + "-" + days;
    },
    /**
    * ---格式日期----
    * 传入一个时间对象和想要转换的时间格式类型
      返回一个字符串时间类型
    * @author 80001078
    * @time 2016年09月1日
    * @param name 参数名（date） 时间类型
    *        name 参数名（format） 格式参数 yyyy-MM-dd
    */

    formatDateTime: function (date, format) {
        var paddNum = function (num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        //指定格式字符
        var cfg = {
            yyyy: date.getFullYear() //年 : 4位
		  , yy: date.getFullYear().toString().substring(2)//年 : 2位
		  , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
		  , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
		  , d: date.getDate()   //日 : 如果1位的时候不补0
		  , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
		  , hh: paddNum(date.getHours())  //时
		  , mm: paddNum(date.getMinutes()) //分
		  , ss: paddNum(date.getSeconds()) //秒
        }
        format || (format = "yyyy-MM-dd hh:mm:ss");
        return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
    },
    /**
	 * ---时间转化时间戳----
	 * @author 80001078
	 * @time 2016年09月01日
	 * @param dateStr 参数名（date） 时间类型
	 */
    getUnixTime: function (dateStr) {
        var newstr = dateStr.replace(/-/g, '/');
        var date = new Date(newstr);
        var time_str = date.getTime().toString();
        return time_str;
    },
    //时间相隔时间差  date1:开始时间  date2：结束时间
    compartoDate: function (date1, date2) {
        date2 = date2 ? date2 : new Date();
        var date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数

        // 计算出相差天数
        var days = Math.floor(date3 / (24 * 3600 * 1000));
        // 计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
        // 计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        // 计算相差秒数
        var leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        if (days < 1) {
            return hours + "小时 ";
        }
        return days + "天" + hours + "小时 ";
        //+ minutes + " 分钟"+ seconds + " 秒";
    }
}

//校验相关
var check = {
    //以前验证手机号
    preLength: 0,//记录上一次电话输入长度
    isPhoneTel: function (o) {
        var phone = o.val();
        var curLenth = 0;
        curLenth = phone.length;
        //限制输入字符不能超过20
        if (curLenth >= 20) {
            phone = phone.substr(0, 20);
            o.value = phone;
            curLenth = 20;
            //COM.mutual.tipsDialog("号码太长了");
            mutual.tipsDialog("号码太长了");
            return;
        }

        if (curLenth > check.preLength) {
            var context = o.val();
            var text1 = context.substring(0, context.length - 1);
            var text2 = context.substring(context.length - 1, context.length);
            if (/^(010|02\d|0[3-9]\d{2})$/.test(text1)) {
                o.val(text1 + '-' + text2);
            }

            if (/^(010|02\d|0[3-9]\d{2})$/.test(phone)) {
                o.val(phone + '-');
                //解决某些机型自动填充“-”后，光标不在最后的问题
                var temp = o.val();
                o.val("");
                o.val(temp);
            }

            if (!phone.match(/(010-|02\d-|0[3-9]\d{2}-)/)) {
                var array = repNumber(o);
                if (array && array.length > 0) {
                    array.forEach(function (e) {
                        phone = phone.replace(e, '');
                    })
                    o.val(phone)

                }
            } else {
                var array = repNumber(o);
                if (array && array.length > 0) {
                    array.forEach(function (e) {
                        if (e != '-') {
                            phone = phone.replace(e, '');
                        }

                    })
                    o.val(phone)

                }
            }
        }
        check.preLength = o.val().length;
        function repNumber(obj) {//提供以上方法
            var reg = /^[\d]+$/g;
            if (!reg.test(obj.val())) {//验证数字。如果是不是数字就进去校验
                var txt = obj.val();
                txt.replace(/[^0-9]+/, function (char, index, val) {//匹配第一次非数字字符
                    obj.val(val.replace(/[^0-9-+]/g, ""));//将非数字字符替换成""
                })
            }
        }
    },

    isNumber: function (obj) {
        var reg = /^[\d]+$/g;
        if (!reg.test(obj.val())) {//验证数字。如果是不是数字就进去校验
            var txt = obj.val();
            txt.replace(/[^0-9]/, function (char, index, val) {//匹配第一次非数字字符
                obj.val(val.replace(/[^0-9]/g, ""));//将非数字字符替换成""
            })
        }
    },
    isPhone: function (input) {
        var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        return reg.test(input);
    },
    isTel: function (input) {
        var reg = /^1[3|5|7|8][0-9]{9}$/; // ???
        return reg.test(input);
    },
    // 表单是否填写完整
    // 参数： [[$("input.phone"),phone], [$("input.user"),length,2]]
    isFull: function (objForm) {
        console.log("Full");
    },
    // 只能输入英文和汉字 返回true和false
    ispattern: function (input) {
        var reg = /[^\u4E00-\uFA29-a-z-A-Z-]/g;
        return reg.test(input);
    },
    //去掉前后空格
    trim: function (v) {
        return v.replace(/(^\s*)|(\s*$)|(\s{2,})/g, '');
    },
    // 获取字符串长度，区分中英文
    getCEL: function (str) {
        if (!str) {
            return str;
        }
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    },

    subCEL: function (str, lenstr) {
        if (!str) {
            return str;
        }
        ///<summary>获得字符串实际长度，中文2，英文1</summary>
        ///<param name="str">要获得长度的字符串</param>
        var realLength = 0, len = str.length, charCode = -1, addlen = 1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
                addlen = 1;

            }
            else {
                realLength += 2;
                addlen = 2;
            }

            if (realLength > lenstr) {
                str = str.substr(0, i)
                return str;
            }
        }
        return str;
    },
    /**
     * 特殊字符处理：只能输入汉字和英文
     * 返回格式化后的字符串
     */
    isSpecialStr: function (obj) {
        //限制输入字符不能超过20
        if (obj.value.length > 20) {
            return;
        }
        var reg = /^([\u4E00-\uFA29]*[a-z]*[A-Z ]*)+$/;
        if (!reg.test(obj.value)) {//验证英文和汉字。如果不是进去校验
            var txt = obj.value;
            txt.replace(/[^\u4E00-\uFA29a-zA-Z ]+/, function (char, index, val) {
                obj.value = val.replace(/[^\u4E00-\uFA29a-zA-Z ]/g, "");
                return false;
            })
            return false;
        } else {
            return true;
        }

    },
    /**
     * 过滤字符处理 返回格式化后的字符串
     */
    filterStrbyReg: function (obj) {
        var reg = /[\u4E00-\uFA29]/;
        if (reg.test(obj.value)) {//验证英文和汉字。如果不是进去校验
            var txt = obj.value;
            txt.replace(/[\u4E00-\uFA29]+/, function (char, index, val) {
                obj.value = val.replace(/[\u4E00-\uFA29]/g, "");
                return false;
            })
            return false;
        } else {
            return true;
        }

    },
    /**
     * 判断不许输入特殊字符。可输入汉字英文和数字
     * @param input
     * @returns true 代表有 false 代表无
     */
    isSpecial: function (obj) {
        var reg = /^([\u4E00-\uFA29]*[a-z]*[A-Z ]*[0-9]*)+$/;
        if (!reg.test(obj.val())) {//验证英文和汉字 数字。如果不是进去校验
            var txt = obj.val();
            txt.replace(/[^\u4E00-\uFA29a-zA-Z ]+/, function (char, index, val) {
                obj.val(val.replace(/[^\u4E00-\uFA29a-zA-Z0-9 ]/g, ""));
                return false;
            })
            return false;
        } else {
            return true;
        }
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
    // 数组去重
    unique: function (arr) {
        var result = [], hashtable = {};
        for (var i = 0; i < arr.length; i++) {
            if (!hashtable[arr[i]]) {
                hashtable[arr[i]] = true;
                result.push(arr[i]);
            }
        }
        return result;
    },
    // 邮箱检验
    mail: function (mailStr) {
        mailStr = mailStr.trim();
        var mailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
        var mailChk = mailReg.test(mailStr);
        return mailChk;
    }
}


//return {
//	DateFormat : DateFormat,
//	check : check
//};
//});
