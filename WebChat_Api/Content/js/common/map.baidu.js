
// 以下为require返回
define(["common"],function(COM){
	var sf_tip_url = "http://gis-rss-core-hint.sit.sf-express.com:5580/tip";
	var sf_geo_url = "http://gis-rss-cx.sit.sf-express.com/geo";
	var sf_rgeo_url = "http://gis-rss-cx.sit.sf-express.com/rgeo";
	var urlArrs = document.URL.split('/');
	if(urlArrs[2]=="ucmp.sf-express.com"){
		sf_tip_url = "http://GIS-RSS-CORE-HINT.sf-express.com/tip";
		sf_geo_url = "http://gis-rss-cx.sf-express.com/geo";
		sf_rgeo_url = "http://gis-rss-cx.sf-express.com/rgeo";
	}
var mMap = {
	mapkg:"sf",//接口调用开关
	sfBmapAK : "u7wFbffxOnpq4grMkogSZ3RM",  // apikey account : silgionbzh ~ silgionbzh@bd （限100W次/天）
	sfApiAk :"14e9ee810854c40f5ae9414f2a62c8cc",//顺丰APIkey
	baiduAK : "ckHXFBZl2TdeolSUTAXbkTUn73iNoP9g",//（限600W次/天）
	// 存储当前位置相关信息
	currPoi: {
		lng: null, // 经度信息
		lat: null, // 纬度信息
		locateSuccess: false, // 定位当前位置是否成功（boolean : 默认为false,未成功定位）
	},
	ico : {
		order : "../Content/css/img/ico-order-sb.gif", //下单图标   后缀为.png为静态下单   .gif 位动态下单图标
		from: "../Content/css/img/ico-pos-from.png", //我的位置图标
		send: "../Content/css/img/ico-pos-send.png", //寄件人位置图标
		received: "../Content/css/img/ico-pos-send-1.png", //已取件
		to: "../Content/css/img/ico-pos-to.png", //收件人位置图标
		run: "../Content/css/img/ico-query-1.png", //运送中
		rrun: "../Content/css/img/ico-query-1-1.png", //运送中
		delivery: "../Content/css/img/ico-query-2.png", //派送中
		complete: "../Content/css/img/ico-query-3.png", // 已签收
		sfstore: "../Content/css/img/ico-sf-store.png", // 服务点
		transit: "../Content/css/img/ico-pos-transit.png", // 中转点
		obsolete: "../Content/css/img/ico-query-5.png", // 已作废，未到目的地
		obsoleteEnd: "../Content/css/img/ico-query-6.png" // 已作废，目的地
	},
	icoSize : {
		normal : COM.mutual.mapIco(175), //下单尺寸
		small : COM.mutual.mapIco(32),
		bigger : COM.mutual.mapIco(140)
	},
	mapFlg :false,

	//html5地理定位
	getLocation: function(callBack,p) {
		if(!p){
			mMap.ipLocation(callBack);
			return;
		}
		try{
			COM.mutual.tipsLoading("正在定位");
			mMap.mapFlg=false;
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, showError, {
					 // 指示浏览器获取高精度的位置，默认为false
					 enableHighAccuracy: true,
					 // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
					 timeout: 2000,
					 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
					 maximumAge: 0
			 });
			} else {
				console.log("浏览器不支持地理定位");
				COM.mutual.tipsDialog("浏览器不支持地理定位");
				mMap.baiduLocation(callBack);

			}
		}catch(e){
			COM.mutual.tipsLoading();
			COM.mutual.tipsDialog("目前网络异常或者定位失败！");
		}
		function showPosition(position) {
			console.log("GPS定位");
			//GPS坐标转百度
			var ggPoint = new BMap.Point(position.coords.longitude, position.coords.latitude);
			//坐标转换完之后的回调函数
			translateCallback = function(data) {

				if(data.status === 0) {
					var poi = {
							lng:data.points[0].lng,
							lat:data.points[0].lat
					};
					COM.page.setStorage("currPoi", JSON.stringify(poi));
					//console.log("经纬度" + data.points[0].lng + "," + data.points[0].lat);
					//var geoc = new BMap.Geocoder();
					//geoc.getLocation(data.points[0], function(rs) {
					//	var addComp = rs.addressComponents;
						//alert(JSON.stringify(rs));
					//});
					callBack(data.points[0],"gps");
				}
			}
			var convertor = new BMap.Convertor();
			var pointArr = [];
			pointArr.push(ggPoint);
			convertor.translate(pointArr, 1, 5, translateCallback);

		}

		function showError(error) {
			console.log("error:" + error.code);
			//map.centerAndZoom("中国", 5);
			mMap.baiduLocation(callBack);
				/*switch (error.code) {
			case error.PERMISSION_DENIED:
				mutual.tipsDialog("定位失败");//,用户拒绝请求地理定位
				break;
			case error.POSITION_UNAVAILABLE:
				mutual.tipsDialog("定位失败");//,位置信息是不可用
				break;
			case error.TIMEOUT:
				mutual.tipsDialog("定位失败");//,请求获取用户位置超时
				break;
			case error.UNKNOWN_ERROR:
				mutual.tipsDialog("定位失败");//,定位系统失效
				break;
			}*/

		}

	},
	/**
	 * 根据百度坐标
	 */
	baiduLocation:function(callBack){
		console.log("百度坐标地理定位");
		// setTimeout(function(){
		// 	if(!mMap.mapFlg){
		// 		mMap.mapFlg=true;
		// 		mMap.ipLocation(callBack);
		// 	}
		// },"1500");
		try{
			var geolocation = new BMap.Geolocation();
			geolocation.getCurrentPosition(function(r){
				// if(mMap.mapFlg){
				// 	return;
				// }
				// mMap.mapFlg=true;
				COM.mutual.tipsLoading();
				if(this.getStatus() == 0){
					if(r.accuracy==null || r.accuracy==""){//用户点击拒绝访问
						mMap.ipLocation(callBack);//通过IP定位
						return;
					}
						var poi = {
							lng: r.point.lng,
							lat: r.point.lat
						};
						COM.page.setStorage("currPoi", JSON.stringify(poi));
						var pp=new BMap.Point(r.point.lng,r.point.lat);
						//var geoc = new BMap.Geocoder();
						//geoc.getLocation(pp, function(rs) {
						///	var addComp = rs.addressComponents;
						//	console.log(addComp);
						//});
						callBack(pp,"baidu");
				}else {
					mMap.ipLocation(callBack);//通过IP定位
					//关于状态码
					//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
					//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
					//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
					//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
					//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
					//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
					//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
					//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
					//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)
				}
			},{enableHighAccuracy: true})
		}catch(e){
			COM.mutual.tipsLoading();
			COM.mutual.tipsDialog("目前网络异常或者定位失败！");
			//mMap.ipLocation(callBack);//通过IP定位
		}
	},

	/**
	 * 根据ip定位
	 */
	ipLocation:function(callBack){
		console.log("IP地理定位");
		COM.mutual.tipsLoading();
		//COM.mutual.tipsDialog("当前GPS信息不可用");
		var poi = {
			lng: 110.211854,
			lat: 32.19808
		};
		COM.page.setStorage("currPoi", JSON.stringify(poi));
		//var pp=new BMap.Point(poi.lng, poi.lat);
		callBack(poi,"ip");
		/*$.ajax({
			type: 'post',
			url: 'http://api.map.baidu.com/location/ip?ak='+mMap.sfBmapAK+'&coor=bd09ll',
			cache: false,
			dataType: 'jsonp',
			success: function(data) {
				mutual.tipsLoading();
				if (data.status == 0) {
					var poi = {
						lng: data.content.point.x,
						lat: data.content.point.y
					};
					page.setStorage("currPoi", JSON.stringify(poi));
					var pp=new BMap.Point(data.content.point.x, data.content.point.y);
					callBack(pp,"ip");
				}
			},
			error: function() {
				callBack("error");
			}
		});*/
	},

	//附近自寄点定位用
	nearbyStoreGetLocation: function(callBack) {
		COM.mutual.tipsLoading("正在定位");
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError, {
				 // 指示浏览器获取高精度的位置，默认为false
				 enableHighAccuracy: true,
				 // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
				 timeout: 2000,
				 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
				 maximumAge: 0
		 });
		} else {
			console.log("浏览器不支持地理定位");
			mMap.nearbyBaiduLocation(callBack);

		}

		function showPosition(position) {
			console.log("GPS定位");
			//GPS坐标转百度
			var ggPoint = new BMap.Point(position.coords.longitude, position.coords.latitude);
			//坐标转换完之后的回调函数
			translateCallback = function(data) {
				if(data.status === 0) {
					callBack(data.points[0],"gps");
				}
			}
			var convertor = new BMap.Convertor();
			var pointArr = [];
			pointArr.push(ggPoint);
			convertor.translate(pointArr, 1, 5, translateCallback);

		}

		function showError(error) {
			console.log("error:" + error.code);
			mMap.nearbyBaiduLocation(callBack);
		}

	},
	nearbyBaiduLocation:function(callBack){
		console.log("百度坐标地理定位");
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == 0){
				if(r.accuracy==null || r.accuracy==""){//用户点击拒绝访问
					//var pp=new BMap.Point(r.point.lng,r.point.lat);
					var pp ={
							lat:"",
							lng:"",
							isReject:true
					}
					callBack(pp,"baidu");
					return;
				}
				var pp=new BMap.Point(r.point.lng,r.point.lat);
				callBack(pp,"baidu");
			}else {
				mMap.ipLocation(callBack);//通过IP定位
			}
		},{enableHighAccuracy: true,
			timeout: 2000,
			maximumAge:0});
	},

	/**
	 * TODO 根据匹配图片显示尺寸
	 * @param icon 图片路径
	 * @param myIcon  地图图标
	 */
	matchIco: function(icon) {
		var myIcon;
		if (icon != "") {
			if (icon == mMap.ico.order) {
				myIcon = new BMap.Icon(icon, new BMap.Size(mMap.icoSize.normal, mMap.icoSize.normal * 0.66), {
					anchor: new BMap.Size(mMap.icoSize.normal / 2, mMap.icoSize.normal * 0.66)
				});
			} else if (icon == mMap.ico.from || icon == mMap.ico.to || icon == mMap.ico.send || icon == mMap.ico.transit) {
				myIcon = new BMap.Icon(icon, new BMap.Size(mMap.icoSize.small, mMap.icoSize.small), {
					anchor: new BMap.Size(mMap.icoSize.small / 2.25, mMap.icoSize.small / 1.7)
				});
			} else if (icon == mMap.ico.run || icon == mMap.ico.rrun || icon == mMap.ico.received || icon == mMap.ico.delivery || icon == mMap.ico.complete || icon == mMap.ico.sfstore || icon == mMap.ico.obsolete || icon == mMap.ico.obsoleteEnd) {
				myIcon = new BMap.Icon(icon, new BMap.Size(mMap.icoSize.bigger, mMap.icoSize.bigger), {
					anchor: new BMap.Size(mMap.icoSize.bigger / 1.9, mMap.icoSize.bigger / 1.1)
				});
			}else if( icon == mMap.ico.sfstore){
				myIcon = new BMap.Icon(icon, new BMap.Size(mMap.icoSize.bigger, mMap.icoSize.bigger), {
					anchor: new BMap.Size(mMap.icoSize.bigger / 2, mMap.icoSize.bigger / 1)
				});
			}
		}
		return myIcon;
	},

	//在地图上添加点
	/*
	 * pointType:gps：GPS定位,baidu:百度坐标定位,ip：ip定位
	 */
	addMarker: function(map, icon, point,pointType, x, y, callback) {
		map.clearOverlays(); //清除地图上所有覆盖物
		map.enableScrollWheelZoom();

		var myIcon = mMap.matchIco(icon);
		var marker = new BMap.Marker(point, {
			icon: myIcon
		});
		map.addOverlay(marker);
		if(pointType=="ip"){
			map.centerAndZoom(point, 5);
		}else{
			map.centerAndZoom(point, 17);
		}
		if(arguments.length >= 6){
			map.panBy(x,y);
		}
		marker.addEventListener("click", function() {
			callback();
		});

	},


	/**
	 * TODO 地址关键字输入提示（选择下拉地址功能）
	 * @param keyword 关键字
	 * @param region  搜索范围
	 * @param callBack  请求回调
	 */
	suggestSearch: function(keyword, region, callBack) {
		$.ajax({
			type: 'post',
			url: 'http://api.map.baidu.com/place/v2/suggestion?query='+keyword+'&region='+region+'&output=json&ak='+mMap.sfBmapAK,
			cache: false,
			dataType: 'jsonp',
			success: function(data) {
				if (data.status == 0) {
					var obj= new Object();
					var list = new Array();
					var result = data.result;
					for(var i=0;i<result.length;i++){
						var district=result[i].district==null?"":result[i].district;//区名称
						var lat="";
						var lng="";
							if(result[i].city.indexOf(region)==-1){
							continue;
						}
						if(result[i].district==""){
							continue;
						}
						if(result[i].location!='' && result[i].location!=null){
							 lat=result[i].location.lat==null?"":result[i].location.lat;//经度
							 lng=result[i].location.lng==null?"":result[i].location.lng;//纬度
						}else{
							continue;
						}
						list.push(result[i]);
					}
					obj.result=list;

					callBack(obj);
				}
			},
			error: function() {
				callBack("error");
			}
		});
	},
	/**
	* TODO 根据关键字搜索百度详细地址信息
	* @param
	* return  地图格式和来源	根据不同来源JSON不一样
	*/
	queryDetailedAdress: function(key,city,sour,callBack) {//默认根据当前城市查询街道
		if(!key){
			return;
		}
		if(sour=="sf"){
			sfLocalQueryAddress(city);//通过顺丰查询
		}else{
			bdLocationFindProCity(city,callBack);//通过百度查询
		}
		//bdLocationFindProCity(city,callBack);//通过百度查询
		function sfLocalQueryAddress(_city){//通过顺丰根据关键字搜索的地址
			$.ajax({
				type: 'post',
				url: sf_tip_url+'?cc=2&q='+key+'&city='+_city+'&ak='+mMap.sfApiAk,
				cache: false,
				timeout : 2000,
				dataType: 'jsonp',
        		jsonp:'cb',
				success: function(data) {
					if (data.status == 0 && data.result.POISum>0) {
						var results = new Array();
						var objs = data.result.POISet;
						for(var i=0;i<objs.length;i++){//去掉地址为空和经纬度为空的数据
							if(!objs[i].adname[0] || !objs[i].adname[1]){
								continue;
							}
							results.push(objs[i]);
						}
						callBack(results,"sf");
					}else{
						bdLocationFindProCity(_city);//转用百度方式查询
					}
				},
				error: function() {
					bdLocationFindProCity(_city);//转用百度方式查询
				}
			});
		}
		function bdLocationFindProCity(_city){
			if(!_city){//没填写城市，则用当前输入的地址的经纬度进行匹配
				mMap.getAddressByLocal(key,function(local){//根据地址返回经纬度
					mMap.getLocalByAddress(local,function(data){//根据经纬度返回当前城市
						if(data){
							bdLocalQueryAddress(data.city);//通过百度查询
						}
					})
				})
			}else{
				bdLocalQueryAddress(_city);//通过百度查询
			}
		}
		function bdLocalQueryAddress(_city){//通过百度根据关键字搜索的地址
			$.ajax({
				type: 'post',
				url: 'http://api.map.baidu.com/place/v2/search?query='+key+'&page_size=10&page_num=0&scope=1&region='+_city+'&output=json&ak='+mMap.sfBmapAK,
				cache: false,
				dataType: 'jsonp',
				success: function(data) {
					if (data.status == 0 && data.results) {
						var results = new Array();
						for(var i=0;i<data.results.length;i++){//去掉地址为空和经纬度为空的数据
							if(!data.results[i].location){
								continue;
							}
							if(!data.results[i].address){
								continue;
							}
							results.push(data.results[i]);
						}
						callBack(results,"bd");
					}
				},
				error: function() {
					callBack("","bd");
				}
			});
		}
	},
	/**
	* TODO 根据详细地址返回经纬度包含省市区
	* @param _local  地址
	*/
	getSFLocalByAddress: function(key,callBack) {
		$.ajax({
			type: 'post',
			url: sf_geo_url+'?cc=2&address='+key+'&city='+'&ak='+mMap.sfApiAk,
			cache: false,
			timeout : 2000,
			dataType: 'jsonp',
			jsonp:'cb',
			success: function(data) {
				if (data.status == 0) {
					callBack(data.result);
				}else{
				callBack("error");
				}
			},
			error: function() {
				callBack("error");
			}
		});
	},
	/**
 * TODO 根据地址信息返回经纬度
 * @param key  详细地址
 */
	getAddressByLocal: function(key,callBack) {
			if(mMap.mapkg=="sf"){//调用顺丰接口
				sf_Local();
			}else{//调用百度接口
				bd_Local();
			}
			function sf_Local(){
				$.ajax({
					type: 'post',
					url:sf_geo_url+'?cc=2&address='+key+'&city=&ak='+mMap.sfApiAk,
					cache: false,
					timeout : 2000,
					dataType: 'jsonp',
					jsonp:'cb',
					success: function(data) {
						COM.mutual.tipsLoading();
						if(data.status == 0) {
							var local = data.result.ycoord + "," + data.result.xcoord;
							callBack(local);
							return;
						}else{
							bd_Local();
						}
					},
					error: function() {
						bd_Local();
					}
				});
			}
			function bd_Local(){
				$.ajax({
					type: 'post',
					url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderOption&output=json&address='+key+'&city=&ak='+mMap.baiduAK,
					cache: false,
					dataType: 'jsonp',
					success: function(data) {
						if(data.status == 0) {
							var local = data.result.location.lat + "," + data.result.location.lng;
							callBack(local);
							return;
						}
						callBack("");

					},
					error: function() {
						callBack("");
					}
				});
			}
	},
	/**
 * TODO 根据经纬度返回地址信息,包含省市区
 * @param _local  地址
 */
	getLocalByAddress: function(_local,callBack) {
		$.ajax({
			type: 'post',
			url: 'http://api.map.baidu.com/geocoder/v2/?ak='+mMap.baiduAK+'&callback=renderReverse&location=' + _local + '&output=json&pois=0',
			cache: false,
			dataType: 'jsonp',
			success: function(data) {
				COM.mutual.tipsLoading();
				if(data.status == 0) {
					callBack(data.result.addressComponent);
					return;
				}
				callBack("");
			},
			error: function() {
				callBack("");
			}
		});
	},

	/**
 * TODO 根据关键字搜索返回百度的uid查询详细地址信息
 * @param uid 百度返回的ID。对应详细地址
 */
	getUidByAdress: function(uid,callBack) {
		callBack("");
		/*if(uid){
			$.ajax({
				type: 'post',
				url: 'http://api.map.baidu.com/place/v2/detail?uid='+uid+'&output=json&scope=1&ak='+mMap.sfBmapAK,
				cache: false,
				dataType: 'jsonp',
				success: function(data) {
					if (data.status == 0 && data.result) {
						callBack(data.result.address);
					}
				},
				error: function() {
					callBack("");
				}
			});
		}else{
			callBack("");
		}*/

	},
	/**
	 * TODO 定位附近10个点
	 * @param callBack  请求回调
	 */
	 localSearch: function(callBack) {
	 	mMap.getLocation(function(poi,_type){
	 		var currpoi = COM.page.getStorage("currPoi");
	 		if(currpoi != undefined) {
	 			currpoi = JSON.parse(currpoi);
	 			//var local = currpoi.lat + "," + currpoi.lng;
	 			sf_PointQuery(currpoi.lat,currpoi.lng);
	 		} else {
	 			this.getLocation(function(point, addComp) {
	 				//var local = point.lat + "," + point.lng;
	 				sf_PointQuery(point.lat,point.lng);
	 			});
	 		}
			if(_type=="ip"){
				 COM.mutual.tipsDialog("未定位到您的所在位置!");
				 return;
			}
	 		COM.mutual.tipsLoading("正在定位");
	 		function sf_PointQuery(_x,_y) {//通过顺丰方式
	 			if(mMap.mapkg=="bd"){
	 				bd_PointQuery(_x,_y);
	 				return;
	 			}
	 			$.ajax({
	 				type: 'post',
	 				url:sf_rgeo_url+'?cc=2&x='+_x+'&y='+_y+'&ak='+mMap.sfApiAk,
	 				//url: sf_rgeo_url+'?cc=2&x=114.437184&y=30.449612&ak='+mMap.sfApiAk,
	 				cache: false,
	 				timeout : 2000,
	 				dataType: 'jsonp',
	 				jsonp:'cb',
	 				success: function(data) {
	 					COM.mutual.tipsLoading();
	 					if(data.status == 0 && data.result.pois.length>0) {
	 						callBack(data,"sf");
	 					}else{
	 						bd_PointQuery(_x,_y);
	 					}
	 				},
	 				error: function() {
	 					bd_PointQuery(_x,_y);
	 				}
	 			});
	 		}
	 		function bd_PointQuery(_x,_y) {//通过百度方式
	 			$.ajax({
	 				type: 'post',
	 				url: 'http://api.map.baidu.com/geocoder/v2/?ak='+mMap.baiduAK+'&callback=renderReverse&location=' + _x+','+_y+ '&output=json&pois=1',
	 				cache: false,
	 				dataType: 'jsonp',
	 				success: function(data) {
	 					COM.mutual.tipsLoading();
	 					if(data.status == 0) {
	 						callBack(data,"bd");
	 					}
	 				},
	 				error: function() {
	 					callBack("error","bd")
	 				}
	 			});
	 		}
	 	},"dw");
	 },
	/**
	 * 地址解析
	 * @param {Object} address 详细地址
	 * @param {Object} callback 回调函数返回point
	 */
	addrPoint: function(address, callBack) {
		// 创建地址解析器实例
		var myGeo = new BMap.Geocoder();
		// 将地址解析结果显示在地图上,并调整地图视野
		myGeo.getPoint(address, function(point) {
			if (point) {
				callBack(point);
			} else {
				callBack("");
			}
		}, "");

	},

	/**
	 * TODO 多点连线
	 * @param points 数组[{"lng": 113.5418530000,"lat": 23.1418220000,"img":mMap.order_ico}]
	 * type 实线虚线 solid dashed
	 */
	setPolyline: function(points, map, type) {
		map.enableScrollWheelZoom(); //滚轮放大缩小
		//map.setViewport(points); // 放到调用的时候设置损视图
		var bPoints = [];
		for (var i = 0; i < points.length; i++) {
			bPoints.push(new BMap.Point(points[i].lng, points[i].lat));
		}
		var polyline = new BMap.Polyline(bPoints, {
			strokeColor: "#00b0ff",
			strokeWeight: 2,
			strokeOpacity: 1,
			strokeStyle: type
		}); //创建折线
		map.addOverlay(polyline); //增加折线
		// if(bPoints.length>=2){
		// 	if(type!="dashed"){
		// 		this.runCarSport(map,
		// 			bPoints[bPoints.length-2].lng,bPoints[bPoints.length-2].lat,
		// 			bPoints[bPoints.length-1].lng,bPoints[bPoints.length-1].lat
		// 		)
		// 	}
		// }

		map.enableScrollWheelZoom(); //滚轮放大缩小
		for(var i = 0; i < bPoints.length; i++) {
			if(!points[i].img){
				continue;
			}
			var myIcon = mMap.matchIco(points[i].img);
			var marker = new BMap.Marker(bPoints[i], {
				icon: myIcon
			});
			map.addOverlay(marker);
		}

	},
	/**
	 * TODO 多点显示视野范围
	 * @param {Object} points格式[{"lng": 113.5418530000,"lat": 23.1418220000,"img":mMap.order_ico}]
	 * @param {Object} map
	 * @param {Object} callback 点击下单图标回调
	 * @param x,y 数字，x/y方向上的偏移
	 */
	setPoints: function(points, map, callback, x, y) {
		map.clearOverlays(); //清除地图上所有覆盖物
		map.enableScrollWheelZoom(); //滚轮放大缩小
		var view = map.getViewport(eval(points));
		var mapZoom = view.zoom-1;
		var centerPoint = view.center;
		map.centerAndZoom(centerPoint, mapZoom);
		var o_lng,o_lat;
		if(arguments.length == 5){
			map.panBy(x,y);
		}
		var bPoints = [];
		for (var i = 0; i < points.length; i++) {
			bPoints.push(new BMap.Point(points[i].lng, points[i].lat));
		}

		for (var i = 0; i < bPoints.length; i++) {
			var myIcon = mMap.matchIco(points[i].img);

			var marker = new BMap.Marker(bPoints[i], {
				icon: myIcon
			});
			map.addOverlay(marker);
			if(points[i].img == mMap.ico.order) {
				o_lng = points[i].lng;
				o_lat = points[i].lat;
				marker.addEventListener("click", function() {
					callback();
				});
			}
		}
		if(o_lng && o_lat){
			map.centerAndZoom(new BMap.Point(o_lng, o_lat), mapZoom);
		}
		//map.setViewport(bPoints);
	},

	/**
	 * TODO 轨迹地图
	 * @param points 数组
	 */
	setTrack: function(points1, points2, map) {
		map.setViewport(points1);
		var passedPoints = [];
		var unPassPoints = [];
		for (var i = 0; i < points1.length; i++) {
			passedPoints.push(new BMap.Point(points1[i].lng, points1[i].lat));
		}
		//把上个点给points2
		unPassPoints.push(passedPoints[passedPoints.length - 1]);
		for (var i = 0; i < points2.length; i++) {
			unPassPoints.push(new BMap.Point(points2[i].lng, points2[i].lat));
		}
		var polyline1 = new BMap.Polyline(passedPoints, {
			strokeColor: "red",
			strokeWeight: 3,
			strokeOpacity: 0.9,
			strokeStyle: "solid"
		}); //创建经过折线
		map.addOverlay(polyline1); //增加折线
		var polyline2 = new BMap.Polyline(unPassPoints, {
			strokeColor: "red",
			strokeWeight: 3,
			strokeOpacity: 0.9,
			strokeStyle: "dashed"
		}); //创建未经过折线
		map.addOverlay(polyline2); //增加折线

		map.enableScrollWheelZoom(); //滚轮放大缩小
		for (var i = 0; i < passedPoints.length; i++) {
			var marker = new BMap.Marker(passedPoints[i]);
			map.addOverlay(marker);
		}
		for (var i = 0; i < unPassPoints.length; i++) {
			var marker = new BMap.Marker(unPassPoints[i]);
			map.addOverlay(marker);
		}

	},

	/**
	 * TODO 汽车显示在轨迹中间位置
	 * @param points 数组
	 */
	runCarSport:function(map,x1,y1,x2,y2){
		var minX= x1 < x2 ? x1 : x2;
		var minY= y1 < y2 ? y1 : y2;
		var maxX= x1 > x2 ? x1 : x2;
		var maxY= y1 > y2 ? y1 : y2;
		var  arrs = [];
		var tmpX = minX,tmpY= minY;
		var ico = "../scripts/common/ico-sf-car-left.png";
		ico = x2 - x1 > 0 ? "../scripts/common/ico-sf-car-right.png" : ico;
		for(var i=0;i<100;i++){
			// var centerX = (maxX - tmpX) / i + tmpX;
			// var centerY = (maxY - tmpY) / i + tmpY;
			var centerX = (x2 - x1) / 100*i + x1;
			var centerY = (y2 - y1) / 100*i + y1;
			tmpX = centerX;
			tmpY = centerY;
			arrs.push(new BMap.Point(centerX, centerY));
		}
		var myIcon = new BMap.Icon(ico, new BMap.Size(48, 48), {    //小车图片  http://developer.baidu.com/map/jsdemo/img/Mario.png
       	//anchor: new BMap.Size(0, 50),    //相当于CSS精灵
        imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
      });

	   window.run = function (){
				var pts = arrs;
				var paths = pts.length;    //获得有几个点

				var carMk = new BMap.Marker(pts[0],{icon:myIcon});
				map.addOverlay(carMk);
				i=0;
				function resetMkPoint(i){
					carMk.setPosition(pts[i]);
					if(i < paths){
						setTimeout(function(){
							i++;
							resetMkPoint(i);
							if(i+2==arrs.length){
								carMk.remove();
								mMap.runCarSport(map,x1,y1,x2,y2);
							}
						},100);
					}
				}
				setTimeout(function(){
					resetMkPoint(5);  //显示调用 resetMkPoint 函数，并从第5个点开始移动
				},100)
		}

		setTimeout(function(){
			run();
		},500);
	}

}

	return	mMap;
});
