define(["zepto","common","units","baidumap","map","cmctly","sc"],function($,cm,units,bdMap,map,cmctly,sc){
	var query_ajax={
			 sendAddress_flg: false,
			 querySendAddress:function(point,pointType,sour){//查询最近寄件地址，填充至寄件人信息
				sc.sending_ctly.mapLoadingEndHTML();//地图加载完后记录时间
			 	cm.mutual.tipsLoading("查询数据中");
				 //var url = "/cx-wechat-order/order/weixin/adress/queryAddressByDistance";
				 //if(pointType=="ip"){
				// url = "/cx-wechat-order/order/weixin/adress/queryAddress";
		    // }
				var _jsonStr={
					    addressId:"",
						memType:"0",
					    address:"",
					    contact:"",
					    telPhone:"",
		                queryType:"0"
					    // latitude:point.lat,
					    // longitude:point.lng
			    };
		    	var s = JSON.stringify(_jsonStr);
		    	var ddArr = {};
		    	ddArr.jsonStr=s;
				$.ajax({
					type : "POST",
					data : ddArr,
					dataType : "json",
					timeout : 3000,
					url: "/CustomerManage/QueryAddress",
					success : function(result) {
						cm.mutual.tipsLoading();
						if(result.success==false || result.success=="false"){
	            	sc.formFromTo.update(clickxd);
								return;
						}
						var obj = result.obj;
						if(obj==0){
			        sc.formFromTo.update(clickxd);
							return;
						}
						//加入街道后执行以下方法
						var address = obj[0].address.replace(/\__/g,"");
		    		if((obj[0].longitude=="" && obj[0].latitude=="") || (parseFloat(obj[0].longitude)==0 || parseFloat(obj[0].latitude)==0)){
							var addrinfo = obj[0]. province+obj[0].city+obj[0].county+address;
							bdMap.getAddressByLocal(addrinfo+"",function(_point){
								var _lng = 110.211854,_lat = 32.19808;
								if(_point){
			                        var _pointArr = _point.split(",");
									_lng = _pointArr[0];
									_lat = _pointArr[1];
								}
								//初始化上門时间
					            unit._queryDay();
					            unit._queryTime(0,"init");
								sc.address.saveAddress(obj[0],address,_lng,_lat,clickxd);
								//更新地址表的经纬度。
			    				sc.address.updateAddress(obj[0].addressId,_lng,_lat);
							});
			    		}else{
							//初始化上門时间
							unit._queryDay();
							unit._queryTime(0,"init");
							sc.address.saveAddress(obj[0], address, obj[0].longitude, obj[0].latitude, clickxd);
			    		}
			    		if(sour=="init"){
						 		sc.sending_ctly.saveSession("sending_ctly_firstAddrId",obj[0].addressId);////首次寄件人地址ID
				    		sc.sending_ctly.loadHTML();
				    	}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						cm.mutual.tipsLoading();
						sc.formFromTo.update(clickxd);
					}
				});
		    },
		//查询时效时效产品。
		queryProductInfo:function(_formFromTo,maptype){//根据收寄件人地址信息查询时效产品信息
			var _sendingAddress = _formFromTo.sendingAddress;
			var _receivingAddress = _formFromTo.receivingAddress;
			if(maptype!="nomap"){
				sc.mapoper.tracingPoint(_sendingAddress,_receivingAddress,clickxd);
			}
			if(!_sendingAddress|| !_receivingAddress){
				return;
			}
			$("#productList").removeClass("hide");
			var _consignTime = "";//转换为日期时间
			var _lastEndTM = 0;//城市截单时间
			if(_formFromTo.hasOwnProperty("pickupDate")){
				var pickupDate = _formFromTo.pickupDate;
				var pickupDay = pickupDate.substring(0,pickupDate.indexOf("__"));//今天 明天 后天
				var pickupTime = pickupDate.substring(pickupDate.indexOf("__")+2);//时间段
				var businessTM = unit.businessMap.get(pickupDay);//获取城市截单时间
				if(businessTM){
					_lastEndTM = businessTM.lastEndTM;
					if(parseInt(_lastEndTM)>=0 && parseInt(_lastEndTM)<=parseInt(businessTM.beginTM)){//如果截单时间在凌晨到早上开始接单时间内
						_lastEndTM="2359";
					}
				}
				if(pickupTime!="一小时内"){
					pickupDay = units.DateFormat.DayTodate(pickupDay);//将今天明天后天转换为日期
					pickupTime=pickupTime.substring(pickupTime.indexOf("~")+1);//取最晚时间段
					if(pickupTime=="00:00"){//加一天
						var date = new Date((new Date(pickupDay)/1000+86400)*1000);
						pickupDay = units.DateFormat.formatDateTime(date,"yyyy-MM-dd");
					}
					_consignTime = pickupDay+" "+pickupTime+":00";
				}
			}
			//寄件城市没有区，则城市-城市
			//寄件城市有区，则区-城市 --暂不做
			//寄件城市和收件城市都有区则 区-区
			var _queryType="2";
			var _originCode=_sendingAddress.countyCode;
			var _destCode=_receivingAddress.countyCode;
			if(!_originCode || !_destCode){
					_queryType="7";
					_originCode = _sendingAddress.locationCode;
					_destCode = _receivingAddress.locationCode;
			}

			var _jsonStr ={
					queryType:_queryType,
					weight:perfect.metaWeight,
					originCode:_originCode,
					destCode:_destCode,
					consignTime:_consignTime

				};
			var s = JSON.stringify(_jsonStr);
	    	var ddArr = {};
	    	ddArr.jsonStr=s;
	    	cm.mutual.tipsLoading("时效产品查询");
			$.ajax({
			    type : "POST",
			    url : "/cx-wechat-order/order/weixin/sending/queryProductInfo",
			    data : ddArr,
			    //async : false,
			    success : function (data) {
			    	cm.mutual.tipsLoading();
			    	data = JSON.parse(data);
			    	if(data.success==false || data.success=="false"){
		    				//cm.mutual.tipsDialog("未获取到有效的时效产品！");
							unit.defaultProduct();
							return;
					}
			    	var result = data.obj;
			    	if(result==0){
			    		//cm.mutual.tipsDialog("未获取到时效产品！");
						unit.defaultProduct();
			    		return;
			    	}
		    		var pro_con = new Array();	//T6 顺丰隔日//T4 顺丰次日//T801 顺丰次晨//T104 顺丰即日
		    		result.sort(function(a,b){
		    			return a.sort-b.sort;
		    		});
		    		for(var i=0;i<result.length;i++){
		    			var expectTime = result[i].timePromsieStandard.substring(result[i].timePromsieStandard.indexOf(" ")+1);//预计到达时间
		    			var ptime = parseInt(query_ajax.pickupTime());//格式化上門时间
		    			var closeTime = "";
		    			var sleOn = "";
		    			var disClass=  "";
		    			if(result[i].closeTime){//截单时间不为空。根据产品截单时间判断。再根据城市截单时间判断

		    				closeTime = parseInt(result[i].closeTime);//产品截单时间
		    				if(closeTime<ptime){
			    				disClass = "unavailable";
			    			}
		    			}else{//根据城市截单时间判断
		    				closeTime = parseInt(_lastEndTM);//截单时间
		    				if(closeTime<ptime){
			    				disClass = "unavailable";
			    			}
		    			}
		    			var fee = result[i].fee;
							fee = fee == "" ? "0" : fee;
							fee = cm.order.CNYFee("fee", new Date(data.nowDate.replace(/-/g,"/")), fee);
		    			var timePromsieStandard = "";
		    			var tpsFlg = false;
		    			if(result[i].timePromsieStandard!=""){
		    				timePromsieStandard = units.DateFormat.dateToDay(result[i].timePromsieStandard);
			    			if(timePromsieStandard=="3"){
			    				timePromsieStandard=result[i].timePromsieStandard.substring(8,result[i].timePromsieStandard.indexOf(" "))+"日";
			    			}
		    			}else{//显示产品名称
		    				var _proname="";
		    				if(result[i].productType=="T6"){//T6 顺丰隔日//T4 顺丰次日//T801 顺丰次晨//T104 顺丰即日
		    					_proname="顺丰隔日";
		    				}else if(result[i].productType=="T4"){
		    					_proname="顺丰次日";
		    				}else if(result[i].productType=="T801"){
		    					_proname="顺丰次晨";
		    				}else if(result[i].productType=="T104"){
		    					_proname="顺丰即日";
		    				}
		    				timePromsieStandard = _proname;
		    				tpsFlg=true;
		    			}

		    			pro_con.push('<li id="'+result[i].productType+'" class="flex-1 '+sleOn+' '+disClass+'" ><p class="pro_day">'+timePromsieStandard+'</p>');
		    			if(!tpsFlg){
		    				pro_con.push('<p class="pro_time">'+expectTime+'前送达</p>');
		    			}
		    			pro_con.push('<p class="price"><span class="yuan">'+parseInt(fee)+'</span></p></li>');
			    	}
		    		$("#productList").html(pro_con.join(""));
	    			//result.sort(function(a,b){
	    				//return a.deltaT-b.deltaT;
	    			//});
		    		for(var i=0;i<result.length;i++){
		    			var  _id = result[i].productType;
		    			if(! $("#"+_id).hasClass("unavailable")){
		    				 $("#"+_id).addClass("on");
		    				break;
		    			}
		    		}
		    		if(!$("#productList li").hasClass("on")){
		    			 $("#"+result[0].productType).addClass("on");
		    		}

			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
		    	cm.mutual.tipsLoading();
				//cm.mutual.tipsDialog("服务器繁忙，请稍后再试");
				unit.defaultProduct();
			}
		  });
		},
		pickupTime: function(){//格式化上門时间
			var _pickupDate  = sc.formInfo.pickupDate;
			var pdate1 = _pickupDate.substring(0,_pickupDate.indexOf("__"));// 今天 明天 后天
			var pdate2 =_pickupDate.substring(_pickupDate.indexOf("__")+2);//上門时间段
			var ptime = "";//上門时间
			//if(pdate1=="今天" || pdate1==""){
				if(pdate2=="一小时内"){//默认上門时间为一小时内
					var date=new Date();
					var hour=date.getHours();
					var min=date.getMinutes();
					if(min<10){
						min="0"+min;
					}
					ptime = hour+""+min;
				}else{//选择上門时间后为选择的上門时间。
					ptime = pdate2.substring(pdate2.indexOf("~")+1).replace(":","");
				}
			//}
			return ptime;
		},
		queryQilot:function(_locationCode,callback){
			cm.mutual.tipsLoading("正在检查");
			var ddArr = {};
			ddArr.locationCode = "{\"locationCode\":[\""+_locationCode+"\"]}";
			$.ajax({
				type : "POST",
				url : "/cx-wechat-order/order/validate/queryIsNonpilotCity",
				data : ddArr,
				dataType : "json",
				success : function(data) {
					cm.mutual.tipsLoading();
					if(data.objs.length>0){//非试点
							cm.mutual.sorryshow("抱歉","您好，由于您选择的寄件地址未参与新版顺丰速运公众号试点，无法完成下单，建议您通过以下方式完成下单");
							return;
					}else{
							callback();
					}
				},
				error : function(XMLHttpRequest, textStatus,errorThrown) {
					cm.mutual.tipsLoading();
					cm.mutual.tipsDialog("服务器繁忙，请稍后再试");
				}
			});
		}
	};
	var arrayDay = new Array();

	//构建可预约日期
	var arrayT = new Array();
	arrayT.push('08:00~09:00');
	arrayT.push('09:00~10:00');
	arrayT.push('10:00~11:00');
	arrayT.push('11:00~12:00');
	arrayT.push('12:00~13:00');
	arrayT.push('13:00~14:00');
	arrayT.push('14:00~15:00');
	arrayT.push('15:00~16:00');
	arrayT.push('16:00~17:00');
	arrayT.push('17:00~18:00');
	arrayT.push('18:00~19:00');
	arrayT.push('19:00~20:00');
	arrayT.push('20:00~21:00');
	arrayT.push('21:00~22:00');
	arrayT.push('22:00~23:00');
	arrayT.push('23:00~00:00');

	var unit={//截单时间
			appointmentNo:"",//预约号
			businessTimeFlg:true,//寄件城市是否有可选择的截单时间
			beginTM:0,
			lastEndTM:0,
			businessMap: new Map(),
			daylist:{},
			timelist:{},
			businessDate:{},
			serviceDate :"",//服务器时间
			serviceTM :0,//服务器小时数
			_queryDay:function(){
				if(!sc.formInfo.sendingAddress){//没有寄件地址。
					unit.sysDatebusinessDay();//调用系统计算天数
					return;
				}
				var _locationCode = sc.formInfo.sendingAddress.locationCode;
				var _jsonStr={
					cityCode:_locationCode
				};
		    	var s = JSON.stringify(_jsonStr);
		    	var ddArr = {};
		    	ddArr.jsonStr=s;
				$.ajax({
		    	    type : "POST",
		    	    url : "/cx-wechat-order/order/weixin/sending/businessTime",
		    	    data : ddArr,
		    	    dataType : "json",
		    	    async : false,
		    	    success : function (data) {
						if(data.success==false || data.success=="false"){
							data="";
						}
						unit.contentBusinessTime(data);
		    			return;
		    	    },
		    		error:function(XMLHttpRequest, textStatus, errorThrown){
						//cm.mutual.tipsDialog("服务器繁忙，请稍后再试");
						unit.contentBusinessTime("");
		    		}
		    	});
			},
			contentBusinessTime:function(data){
				if(!data){
					var _serviceDate = units.DateFormat.formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss");
					var _serviceTM = _serviceDate.substring(11,16).replace(":","");
					data ='{"obj":[{"data":"今天","beginTM":"0800","lastBeginTM":"0800","endTM":"2000","lastEndTM":"2000"},'+
					'{"data":"明天","beginTM":"0800","lastBeginTM":"0800","endTM":"2000","lastEndTM":"2000"},'+
					'{"data":"后天","beginTM":"0800","lastBeginTM":"0800","endTM":"2000","lastEndTM":"2000"}],'+
					'"serviceDate":"'+_serviceDate+'","serviceTM":" '+_serviceTM+'"}';
					data = JSON.parse(data);
				}
				unit.lastEndTM = data.obj[0].lastEndTM;
				unit.beginTM = data.obj[0].beginTM;
				unit.serviceDate = data.serviceDate;
				unit.serviceTM = parseInt(data.serviceTM);
				var _time = parseInt(data.serviceTM);
				arrayDay.length = 0;
				 for(var i=0;i<data.obj.length;i++){
					 unit.businessMap.put(data.obj[i].data,data.obj[i]);
					 var lastEndTM = data.obj[i].lastEndTM;
					if(lastEndTM!="2359" && lastEndTM!=""  && lastEndTM>data.obj[i].beginTM){
						 if(lastEndTM.indexOf(":")!=-1){
							 lastEndTM = lastEndTM.replace(":","");
						 }
						lastEndTM = parseInt(lastEndTM)-100;
						 if(data.obj[i].data=="今天"){
							 if(_time<lastEndTM){
								arrayDay.push(data.obj[i].data);
							}
						 }else{
							arrayDay.push(data.obj[i].data);
						 }
					 }else{//没有截单时间。不截单
						arrayDay.push(data.obj[i].data);
					 }

				 }
				unit.businessDate=data;
				unit.daylist = arrayDay;
			},
			_queryTime:function(_index,_sour){
				var _time = unit.serviceTM;
				var times = new Array();
				var data = unit.businessDate;
				if(arrayDay[_index]==""){
					return;
				}
				if(!data.obj){
					return;
				}
				if(data.obj.length==0){
					return;
				}
        		for(var j=0;j<data.obj.length;j++){
		        	if(arrayDay[_index]==data.obj[j].data){
		        		if(arrayDay[_index]=="今天"){
							if(unit.beginTM<=_time){
								times.push("一小时内");
							}
		    			}
			      		for(var i = 0; i<arrayT.length;i++){
			      			var t1 = arrayT[i].substring(0,arrayT[i].indexOf("~"));
			  				var t2 = arrayT[i].substring(arrayT[i].indexOf("~")+1);
			  				var t1 = unit.resTime(t1);
			  				var t2 = unit.resTime(t2);
							 var beginTM = data.obj[j].beginTM;
							 if(beginTM.indexOf(":")!=-1){
								 beginTM = beginTM.replace(":","");
							 }
							 beginTM = parseInt(beginTM);
							 var lastEndTM = data.obj[j].lastEndTM;
							 if(lastEndTM!="2359" && lastEndTM!="" && lastEndTM>data.obj[j].beginTM){
								 if(t2<=0){
									continue;
								}
								 if(lastEndTM.indexOf(":")!=-1){
									 lastEndTM = lastEndTM.replace(":","");
								 }
								lastEndTM = parseInt(lastEndTM)-100;
								if(t1>=beginTM && t2<=lastEndTM){
			            			if(arrayDay[_index]=="今天"){
										if(t1-_time<30 ){
											continue;
										}
			            			}
									times.push(arrayT[i]);
								}
							 }else{
								 if(t1>=beginTM){
				      				if(arrayDay[_index]=="今天"){
										if(t1-_time<30 ){continue;}
				        			 }
									times.push(arrayT[i]);
								  }
							 }
			      		 }
	  				}
	    		}

	    var formInfoSession = JSON.parse(cm.page.getStorage("orderFormInfo"));
	    if (!formInfoSession.hasOwnProperty("pickupDate")) {//session中没有
	      unit.sessionPickupDate(times);
	    }else{//session中有
				if(_sour=="init"){
					var pd = sc.formInfo.pickupDate;
					var pd_d = pd.substring(0,pd.indexOf("__"));
					var pd_t = pd.substring(pd.indexOf("__")+2);
					if(pd_d!=arrayDay[0]){
						unit.sessionPickupDate(times);
					}else{
						if( pd_t!=times[0]){
							unit.sessionPickupDate(times);
						}
					}
				}
		  }
			return times;
			},
			sessionPickupDate:function(times){//将上门时间填充到页面并且放入session中
				if(arrayDay[0]=="今天"){
					arrayDay[0]=="";
				}
				sc.formInfo.pickupDate=arrayDay[0]+"__"+times[0];
				sc.formFromTo.pickupDate = arrayDay[0]+"__"+times[0];
			    var daytimeval = arrayDay[0] + times[0];
				if(arrayDay[0]=="今天"){
					daytimeval =  times[0];
				}
				$(".form-from-to .pickup-date").find("p.right").text(daytimeval);
				sc.formInfo.save();
			},
			sysDatebusinessDay:function(){
				var _time = unit.serviceTM;
				arrayDay.length = 0;
				if(_time<2359){
					arrayDay.push("今天");
				}
				arrayDay.push("明天");
				arrayDay.push("后天");
				unit.daylist = arrayDay;
			},
			sysDatebusinessTime:function(_index){
				var _time =unit.serviceTM;
				var times = new Array();
				if(arrayDay[_index]==""){
					return;
				}
	    		if(arrayDay[_index]=="今天"){
					times.push("一小时内");
				}
	    		for(var i = 0; i<arrayT.length;i++){
	    			var t1 = arrayT[i].substring(0,arrayT[i].indexOf("~"));
					var t2 = arrayT[i].substring(arrayT[i].indexOf("~")+1);
					var t1 = unit.resTime(t1);
					var t2 = unit.resTime(t2);
					if(t2<=0){
						continue;
					}
	    			if(arrayDay[_index]=="今天"){
						if(t1-_time<30 ){
							continue;
						}
	    			}
					times.push(arrayT[i]);
	    		}
				return times;
			},
			 resTime:function(_t){//当时间为整点时，减去40
				 if(_t.indexOf("00")!=-1){
					 _t = parseInt(_t.replace(":",""))-40;
					}else{
						_t = parseInt(_t.replace(":",""));
					}
				 return _t;
			 },
			 //默认T4产品
			 defaultProduct: function(){
 				  var pro_con = new Array();
 				  pro_con.push(' <li id="T4" class=" flex-1 on"><p class="pro_day">明天</p><p class="pro_time">20:00前送达</p><p class="price"><span class="yuan">13</span></p></li>');
 	              $("#productList").html(pro_con.join(""));
 			}

	};
	var xdFlg = false;
	function clickxd(){//预约下单
		sc.sending_ctly.submitOrder_clty();
		if(!sc.formInfo.sendingAddress && !sc.formInfo.receivingAddress){//寄件地址和收件地址都未填写时，跳转至寄件地址填写页面
			 sc.formFromTo.from.sendingFrom.click();
			 return;
		}else if(!sc.formInfo.sendingAddress && sc.formInfo.receivingAddress){//寄件地址未填写,收件地址填写时，跳转至寄件地址填写页面
			 sc.formFromTo.from.sendingFrom.click();
			 return;
		}else if(sc.formInfo.sendingAddress && !sc.formInfo.receivingAddress){//收件地址未填写,寄件地址填写时，跳转至收件地址填写页面
			 sc.formFromTo.from.receivingFrom.click();
			 return;
		}

		var formInfoSession = JSON.parse(cm.page.getStorage("orderFormInfo"));
		var receivingAddress = formInfoSession.receivingAddress;
		var sendingAddress = formInfoSession.sendingAddress;
		var _proType="";//时效产品类型
		if(!$("#productList li.on").hasClass("unavailable")){
			_proType=$("#productList li.on").attr("id");
		}
		var submitStatus=true; //提交状态
		var errorInfo = "";//无法成功提交时缺少的字段
		if(!_proType){
			cm.mutual.tipsDialog("请选择有效的时效产品哦~");
			errorInfo = "未请选择有效的时效产品";
			submitStatus=false;
		}
		if(!unit.businessTimeFlg){
			cm.mutual.tipsDialog("寄件城市目前无法预约下单");
			errorInfo = "寄件城市目前无法预约下单";
			submitStatus=false;
		}

		if(!$(".sending-agree").hasClass("on")){
			cm.mutual.tipsDialog("未同意《快件运单契约条款》哦~");
			errorInfo = "未同意《快件运单契约条款》";
			submitStatus=false;
		}
		if (!/^\d{3,4}$/.test(sendingAddress.locationCode)) {
			cm.mutual.tipsDialog("寄件地址信息异常，请重新编辑地址并且保存！");
			errorInfo = "寄件地址信息异常-locationCode为空，请重新编辑地址并且保存！";
			submitStatus = false;
		}

		if (!/^\d{3,4}$/.test(receivingAddress.locationCode)) {
			cm.mutual.tipsDialog("收件地址信息异常，请重新编辑地址并且保存！");
			errorInfo = "收件地址信息异常-locationCode为空，请重新编辑地址并且保存！";
			submitStatus = false;
		}
		if(!sendingAddress.county || sendingAddress.county=="null"){
				cm.mutual.tipsDialog("寄件地址信息行政区未找到，请重新编辑地址并且保存！");
				errorInfo = "寄件地址信息行政区未找到，请重新编辑地址并且保存！";
				submitStatus=false;
		}
		if(!receivingAddress.county || receivingAddress.county=="null"){
				cm.mutual.tipsDialog("收件地址信息行政区未找到，请重新编辑地址并且保存！");
				errorInfo = "收件地址信息行政区未找到，请重新编辑地址并且保存！";
				submitStatus=false;
		}
		// 判断地址/电话过长
		if (units.check.getCEL(/*sendingAddress.province + sendingAddress.city + sendingAddress.county + */sendingAddress.address) > 100) {
			cm.mutual.tipsDialog("寄件地址过长，请修改后提交！");
			errorInfo = "寄件地址过长！";
			submitStatus = false;
		}
		if (units.check.getCEL(/*receivingAddress.province + receivingAddress.city + receivingAddress.county + */receivingAddress.address) > 100) {
			cm.mutual.tipsDialog("收件地址过长，请修改后提交！");
			errorInfo = "收件地址过长！";
			submitStatus = false;
		}
		if (units.check.getCEL(sendingAddress.contactPhone) > 14 || units.check.getCEL(sendingAddress.contactTel) > 14) {
			cm.mutual.tipsDialog("寄方联系电话过长，请修改后提交！");
			errorInfo = "寄方联系电话过长！";
			submitStatus = false;
		}
		if (units.check.getCEL(receivingAddress.contactPhone) > 14 || units.check.getCEL(receivingAddress.contactTel) > 14) {
			cm.mutual.tipsDialog("收方联系电话过长，请修改后提交！");
			errorInfo = "收方联系电话过长！";
			submitStatus = false;
		}
		if(xdFlg){
			cm.mutual.tipsDialog("请不要着急哦，正在提交中");
			errorInfo = "重复提交拦截";
			submitStatus=false;
		}
		if(!submitStatus){
			sc.sending_ctly.submitError_clty(errorInfo);
			return;
		}
		var pickupDate = formInfoSession.pickupDate;
		var day = 	pickupDate.substring(0,pickupDate.indexOf("__"));
		var times = pickupDate.substring(pickupDate.indexOf("__")+2);
		var expectStartTime="";
		var expectEndTime=units.DateFormat.formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss");

		//var servicedate = unit.serviceDate.replace(/-/g,"/");
		if(day=="今天" || day==""){
			var date=new Date();
			if(times!="一小时内"){//选择上門时间后为选择的上門时间。
				var startT= times.substring(0,times.indexOf("~"))+":00";
				var endT= times.substring(times.indexOf("~")+1)+":00";
				expectStartTime = units.DateFormat.formatDateTime(date,"yyyy-MM-dd")+" "+startT;
				if(endT=="00:00:00"){//加一天
					date = new Date((date/1000+86400)*1000);
				}
				expectEndTime =  units.DateFormat.formatDateTime(date,"yyyy-MM-dd")+" "+endT;
			}
		}else{
			var lastdate=new Date();
			if(day=="明天"){
				lastdate= lastdate.setDate(lastdate.getDate()+1);
			}else if(day=="后天"){
				lastdate= lastdate.setDate(lastdate.getDate()+2);
			}
			var  d = new Date(lastdate);
			var startT= times.substring(0,times.indexOf("~"))+":00";
			var endT= times.substring(times.indexOf("~")+1)+":00";

			expectStartTime = units.DateFormat.formatDateTime(d,"yyyy-MM-dd")+" "+startT;
			if(endT=="00:00:00"){//加一天
					d = new Date((d/1000+86400)*1000);
			}
			expectEndTime = units.DateFormat.formatDateTime(d,"yyyy-MM-dd")+" "+endT;
		}
		var _proname="";
		if(_proType=="T6"){//T6 顺丰隔日//T4 顺丰次日//T801 顺丰次晨//T104 顺丰即日
			_proname="顺丰隔日";
		}else if(_proType=="T4"){
			_proname="顺丰次日";
		}else if(_proType=="T801"){
			_proname="顺丰次晨";
		}else if(_proType=="T104"){
			_proname="顺丰即日";
		}
		var price = $("#"+_proType+" .price").text();//预估价格

		var  appointName = sendingAddress.contactName;
		var appointTel = sendingAddress.contactTel;
		var appointData = JSON.parse(cm.page.getStorage("appointSession"));
		if(appointData){
			appointName=appointData.appointName;//预约人姓名
			appointTel=appointData.appointTel;//预约人电话
		}

		query_ajax.queryQilot(sendingAddress.locationCode,function(){
			xdFlg=true;
			var s_cityCode =  sendingAddress.cityCode;
			var r_cityCode =  receivingAddress.cityCode;
			var s_locationCode =  sendingAddress.locationCode;
			var r_locationCode =  receivingAddress.locationCode;
			if(s_cityCode.indexOf("A")==0 || s_cityCode.indexOf("a")==0){
				s_LocationCode="";
			}
			if(r_cityCode.indexOf("A")==0 || r_cityCode.indexOf("a")==0){
				r_locationCode="";
			}
			var _jsonStr = {
					sysCode:"WEIXIN",   //系统码 ,必填
					language:"zh",
					expectStartTm: expectStartTime,  //最早上门时间
					expectFinishTm: expectEndTime, //最晚上门时间
					//appointmentTime: units.DateFormat.formatDateTime(new Date(),"yyyy-MM-dd hh:mm:ss"),   //预约时间
					countryCode: "CN",  //国家,必填
					mediaCode: "wx",  //媒体码 必填
					remark: "",  //媒体码 必填
					pickupType: "1",    //预约请求0.服务点自寄 1.上门收件 2.丰巢柜自寄
					sendAddressId: sendingAddress.addressId,   //寄件人地址ID
					receiveAddressId: receivingAddress.addressId,  //收件人地址ID
					sendingCityCode: sendingAddress.cityCode,
					receivingCityCode: receivingAddress.cityCode,
					//sendingMemType: sendingAddress.memType,
					//receivingMemType: receivingAddress.memType,
					appointmentInfo :{ //预约人信息 ,不能null
					addrInfo: {
		 		          country: sendingAddress.country || "中国",
		 		          address: sendingAddress.address,
		 		          province: sendingAddress.province,
		 		          city: sendingAddress.city,
		 		          provinceCode: sendingAddress.provinceCode,
		 		          county: sendingAddress.county,
		 		          addrId: sendingAddress.addressId,
		 		          locationCode: s_locationCode
		 		        },
		 		        phone: sendingAddress.contactPhone,
		 		        contact: units.check.subCEL(appointName,20),
		 		        mobile: appointTel
					},
			 		appointmentList: [   //快递信息，不能为null
		 		    {
		 		      destinationInfo: {  //收件方信息
		 		        addrInfo: {
		 		          country: receivingAddress.country  || "中国",
		 		          address: receivingAddress.address,
		 		          province: receivingAddress.province,
		 		          city: receivingAddress.city,
		 		          provinceCode: receivingAddress.provinceCode,
		 		          county: receivingAddress.county,
		 		          addrId: receivingAddress.addressId ,
		 		          locationCode: r_locationCode
		 		        },
		 		        phone: receivingAddress.contactPhone,
		 		        contact: units.check.subCEL(receivingAddress.contactName,20),
		 		        mobile: receivingAddress.contactTel
		 		      },
		 		      metaWeight: "1",     //预估重量
		 		      metaPrice: price,     //预估价格
		 		      originateInfo: { //寄件人
			    	  addrInfo: {
		 		          country: sendingAddress.country || "中国",
		 		          address: sendingAddress.address,
		 		          province: sendingAddress.province,
		 		          city: sendingAddress.city,
		 		          provinceCode: sendingAddress.provinceCode,
		 		          county: sendingAddress.county,
		 		          addrId: sendingAddress.addressId,
		 		          locationCode: s_locationCode
		 		        },
		 		        phone: sendingAddress.contactPhone,
		 		        contact: units.check.subCEL(sendingAddress.contactName,20),
		 		        mobile: sendingAddress.contactTel
		 		      },
		 		      levelOfService: {
		 		        product: {
		 		         	code: _proType,
		 		         	name: _proname
		 		        },
		 		        provider: "SF"
		 		      }
		 		    }
		 		  ]
			};
			var s = JSON.stringify(_jsonStr);
			var ddArr = {};
			ddArr.jsonStr=s;
			cm.mutual.tipsLoading("下单中");
			$.ajax({
			    type : "POST",
			    url : "/cx-wechat-order/order/weixin/sending/bookingOrder",
			    data : ddArr,
			    dataType : "json",
			    async : true,
			    success : function (data) {
					cm.mutual.tipsLoading();
					sc.sending_ctly.sendingAddrEqual_clty(sendingAddress.addrId);
			    	xdFlg = false;
			    	if(data.success==false || data.success=="false"){
						if(data.errorCode=="EMPTY_LOCATIONCODE_SEND"){
							cm.mutual.tipsDialog("寄件地址信息异常，请重新编辑地址并且保存");
						}else if(data.errorCode=="EMPTY_LOCATIONCODE_RECEVING"){
							cm.mutual.tipsDialog("收件地址信息异常，请重新编辑地址并且保存");
						}else{
			    			cm.mutual.tipsDialog("下单失败，请稍后重试！");
						}
						return;
			    	}
			    	if(!data.result.appointmentNo){
						cm.mutual.tipsDialog("生成预约单失败，请稍后重试！");
						return;
					}
					// 正在分配小哥
			    	$(".success-animation").fadeIn();
			    	unit.appointmentNo = data.result.appointmentNo;

			    	//下单所用时长
					sc.sending_ctly.submitOrder_TM_clty(data.result.appointmentNo);
					cmctly.end();
					//清空缓存和所有信息
				  sc.formFromTo.emptyAll();
					setTimeout(function(){
						$(".success-animation").fadeOut();
						window.location.href="/cx/order/order-detail.html?from=sending&appointmentNo="+data.result.appointmentNo +"&t="+(new Date()).getTime();
					},3000);

			    },
				error:function(XMLHttpRequest, textStatus, errorThrown){
					cm.mutual.tipsLoading();
					xdFlg = false;
					cm.mutual.tipsDialog("请求服务器异常");
				}
			});
		});
	}
	var fillin = {
		 init: function(){
			$(".pickup-date").removeClass("hide");
			$("#titName").text("快递员上门");
			fillin.getForm();//填充表单中数据
			sc.formFromTo.bindClick("sending");//查询表单的绑定数据
	    },
     	getForm: function(){//从session中获取数据
	    	  var fromPage = cm.page.getUrlParm("from");
	     		if(fromPage=="address"){//从选择地址页面返回回来触发
				  	 	var formInfoSession = JSON.parse(cm.page.getStorage("orderFormInfo"));
		          if(!formInfoSession){//用户下完预约单后，返回到下单页面时触发
	         		//填充寄件人信息
	            	sc.formFromTo.update(clickxd,query_ajax.querySendAddress);
	           	}else{
								sc.formFromTo.update(clickxd);//更新session
	         	 //初始化上門时间
	             unit._queryDay();
	             unit._queryTime(0,"init");
	         	//时效产品计算
	         		query_ajax.queryProductInfo(sc.formInfo);
			  		  }
	     		}else{//用户直接进来后触发
	         		sc.formFromTo.update(clickxd,query_ajax.querySendAddress);
					cm.order.CNYFee();
	     		}
	     }
	}

    var perfect = {
		selAppointInfo:function(o){//预约人事件
        	  var appoint = cm.mutual.footerFix("contact","预约人信息");
			  var appointData = JSON.parse(cm.page.getStorage("appointSession"));
			  if(appointData){
				appoint.user.val(appointData.appointName);//预约人姓名
   				appoint.tel.val(appointData.appointTel);//预约人电话
			  }
			 appoint.user.focus(function(){//点击预约人姓名触发
		    	 o.addClass("inputting");
			}).blur(function(){
		    	  o.removeClass("inputting");
		    }).on("input",function(){
				  var t = this;
				  setTimeout(function(){//解决苹果原生输入法问题
					 var flg = units.check.isSpecialStr(t);
				  },100);
		    });
			appoint.tel.focus(function(){//点击预约人电话触发
		    	  o.addClass("inputting");
			}).blur(function(){
		    	  o.removeClass("inputting");
		    }).on("input",function(){
		    	  	units.check.isPhoneTel(appoint.tel);
		    });
			//点击预约 确定 触发
    		appoint.btn.on("click",function(){
				if(appoint.user.val()==""){
					cm.mutual.tipsDialog("预约人姓名记得填写哦");
		    		return;
	    		}else if(appoint.tel.val()==""){
		    		cm.mutual.tipsDialog("预约人电话记得填写哦");
		    		return;
	    		}
				var appointSession={
					appointName:appoint.user.val(),//预约人姓名
					appointTel:appoint.tel.val()//预约人电话
					};
				cm.page.setStorage("appointSession",JSON.stringify(appointSession)); //预约人信息存入缓存
				appoint.close();
			});
			 appoint.clos.on("click",function(){
   			  appoint.close();
   		  });

		},
		selBusinessTime:function(o){//上门时间事件
			 unit._queryDay();
			  var businessTimeList ={};
			  if(sc.formInfo.sendingAddress==undefined){
				 // businessTimeList = unit.sysDatebusinessTime(0);//调用系统计算上門时间
				cm.mutual.tipsDialog("请先选择寄件地址哦~");
				return;
			  }else{
				  businessTimeList = unit._queryTime(0,"click");
			  }
		    var a = unit.daylist;
		    var b = {
	    		init :businessTimeList,
	    		returnList : function(index){
	    			var ds ={};
	    			 if(sc.formInfo.sendingAddress==undefined){
	    				ds = unit.sysDatebusinessTime(index);//调用系统计算上門时间
	    			 }else{
	    				ds = unit._queryTime(index,"huadong");
	    			 }
	    			return ds;
	    		}
		    };
		      var p = sc.formInfo.pickupDate;
		      var pd ="",pt ="";//上門预约天数和上門预约时间段
		      if(p){
		      	pd = p.substring(0,p.indexOf("__"));//今天 明天 后天
		      	pt = p.substring(p.indexOf("__")+2);//时间段
		      }
		    	cm.order.selector("上门时间","double",3,a,b,function(v1,v2){
	        sc.formInfo.pickupDate=v1+"__"+v2;
	        if(v2=="一小时内"){
	        	 v1="";
	        }
	        if(v1 == "今天"){
	      	 v1 = "";
	        }
	        o.find("p.right").text(v1 + v2);
	        sc.formFromTo.pickupDate = v1+"__"+ v2;
	        sc.formInfo.save();
	        query_ajax.queryProductInfo(sc.formInfo,"nomap");
				  sc.sending_ctly.bussTM_clty(v1 + v2);
		    },pd,pt);
		}
	}
	$(function(){
		fillin.init();
		var appData = cm.page.getStorage("appointSession");
		//如果有预约人。则显示
		if(appData){
		   $("#appointInfo").removeClass("hide");
        //点击预约人详情
        $("#appointInfo").on("click",function(){
      	  perfect.selAppointInfo($(this));
        });
		 }
		 sc.formFromTo.from.pickupFrom.on("click",function(){
			 perfect.selBusinessTime($(this));
		 });
		$(".success-animation").on("click",".close",function(){
			window.location.href="/cx/order/order-detail.html?from=sending&appointmentNo="+unit.appointmentNo +"&t="+(new Date()).getTime();
			$(".success-animation").fadeOut();
		});
		$("#selnowPointId").on("click",function(){
			var _sendingAddress = sc.formInfo.sendingAddress;
			var _receivingAddress = sc.formInfo.receivingAddress;
			if(!_sendingAddress && !_receivingAddress){
				sc.mapoper.getPosition("",clickxd);
			}else{
				sc.mapoper.getPosition("update",clickxd);
				sc.mapoper.tracingPoint(_sendingAddress,_receivingAddress,clickxd);
			}
		});

        if(!sc.mapoper.mapFlg){
			$("#submitBtn").on("click",function(){
				clickxd();
			});
		}
	});

	$("window").on("unload",function(){
		if(sc.sending_ctly.isCloseCountly){
			cmctly.end();
		}
	})
});
