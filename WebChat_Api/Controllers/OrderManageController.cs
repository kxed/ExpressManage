using Application.ExpressModule.OrderManagement;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.IoC;
using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebChat_Api.Authorize;
using WebChat_Api.Filters;
using WebChat_Api.Models;

namespace WebChat_Api.Controllers
{
    public class OrderManageController : BaseController
    {
        //
        // GET: /OrderManage/
        IOrderManagementServices orderServices = IoCFactory.Instance.CurrentContainer.Resolve<IOrderManagementServices>();
        public ActionResult Create()
        {
            //var cache = Caching.GetCache("access_token");
            ////cache = "yOunEwcQOyLBBkXERE7ViQHMFNDRVbrdN57mYLNfAtzCXEsb11rCXdvIMRk2jpXTy61oG-_bGyL2cEQ-JToOmSH2gbOeL4K5MIJVr73dpd2xbx3V5i5Dj-Efr8NJtugWSAYhAAAZHF";
            //if (cache != null && cache != "")
            //{
            //    SysLog.Write("系统异常", "进来了cache:" + cache);
            //    var tem = new WeChatTemplatecsMsg()
            //    {
            //        touser = "okP1KwtHFXKRHTt-2wpa329WAcic",
            //        template_id = "5Jb1WzFURFbhZCEL4AsxyH7bvQmtqUKVbM4jatymy4A",
            //        url = "http://luohe.imwork.net/Authentication/ReplyMessageCallBack",
            //        data = new Dictionary<string, MessageData>
            //        {   
            //            {"first", new MessageData { value = "尊敬的客户：" } },
            //            {"keyword1",new MessageData{value="我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。"}},
            //            {"keyword2", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
            //            {"keyword3", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
            //            {"remark", new MessageData{ value = "感谢您的使用。" }}
            //        }
            //    };
            //    //string jsonText = "{\"touser\":\"OPENID\",\"template_id\":\"templateId\",\"url\":\"urlData\",\"topcolor\":\"#FF0000\",\"data\":{\"first\": {\"value\":\"firstData\",\"color\":\"#173177\"},\"keyword1\": {\"value\":\"keyword1Data\",\"color\":\"#173177\"},\"keyword2\": {\"value\":\"keyword1Data\",\"color\":\"#173177\"},\"remark\": {\"value\":\"remarkData\",\"color\":\"#173177\"}}}";
            //    //jsonText = jsonText.Replace("OPENID", "okP1KwtHFXKRHTt-2wpa329WAcic").Replace("templateId", "tLvswWyYgNFKsZBWKf_zK70ZOK6QjohBBeEAZuCa0Pg")
            //    //    .Replace("urlData", "http://luohe.imwork.net/Authentication/ReplyMessageCallBack").Replace("firstData", "尊敬的客户：\r\n我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。")
            //    //    .Replace("keyword1Data", DateTime.Now.ToString(AppConst.DateTimeChineseMonth)).Replace("keyword2Data", DateTime.Now.ToString(AppConst.DateTimeChineseMonth)).Replace("remarkData", "感谢您的使用。");
            //    //string jsonText = "{\"touser\":\"OPENID\",\"template_id\":\"templateId\",\"url\":\"urlData\",\"topcolor\":\"#FF0000\",\"data\":{\"first\": {\"value\":\"firstData\",\"color\":\"#173177\"}}}";
            //    //jsonText = jsonText.Replace("OPENID", "okP1KwtHFXKRHTt-2wpa329WAcic").Replace("templateId", "E5x2QawHTditDLbj4Dcuvk2-itVWdI26qzhv9RdDM2k")
            //    //    .Replace("urlData", "http://luohe.imwork.net/Authentication/ReplyMessageCallBack").Replace("firstData", "尊敬的客户：我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。");

            //    //string jsonText = "{\"touser\":\"OPENID\",\"template_id\":\"templateId\",\"url\":\"urlData\",\"topcolor\":\"#FF0000\",\"data\":{\"first\": {\"value\":\"firstData\",\"color\":\"#173177\"},\"price\": {\"value\":\"priceData\",\"color\":\"#173177\"}}}";
            //    //jsonText = jsonText.Replace("OPENID", "okP1KwtHFXKRHTt-2wpa329WAcic").Replace("templateId", "8qeGj8MOgtskGeMkSTENXB4bOkUHOIlI7gWQF5Kv8Iw")
            //    //    .Replace("urlData", "http://luohe.imwork.net/Authentication/ReplyMessageCallBack").Replace("firstData", "99585")
            //    //    .Replace("priceData", "100.00");

            //    //var tem = new
            //    //{
            //    //    touser = this.CurrentLoginUser.ClientID,
            //    //    template_id = "tLvswWyYgNFKsZBWKf_zK70ZOK6QjohBBeEAZuCa0Pg",
            //    //    url = "http://luohe.imwork.net/Authentication/ReplyMessageCallBack",
            //    //    data = new
            //    //    {
            //    //        first = new { value = "尊敬的客户：\r\n我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。" },
            //    //        keyword1 = new { value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) },
            //    //        keyword2 = new { value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) },
            //    //        remark = new { value = "感谢您的使用。" },
            //    //    }
            //    //};
            //    //var getmenu = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=" + cache;
            //    //Util.CustWebRequest(getmenu,"",reqTyp:"GET");
            //    string url = string.Format("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={0}", cache);
            //    SysLog.Write("系统异常", "请求url:" + url + " 请求data:" + JsonConvert.SerializeObject(tem));
            //    var result = Util.CustWebRequest(url, JsonConvert.SerializeObject(tem), contentType: "application/json");
            //    var r = JsonConvert.DeserializeObject<MessageReturn>(result);
            //    if (r.errmsg != "ok")
            //    {
            //        SysLog.Write("系统异常", string.Format("异常信息，推送消息失败，失败错误代码：{0}，错误消息：{1}", r.errcode, r.errmsg));
            //    }
            //}

            return View();
        }
        [Notification(NotigicationType.SubmitOrder, "jsonStr")]
        public ActionResult SubmitOrder(string jsonStr)
        {
            try
            {
                if (string.IsNullOrEmpty(jsonStr))
                {
                    return ModelStateToJsonResult<AjaxResult>((re) => { re.status = false; re.errormessage = "参数有误！"; });
                }
                var orderInfo = JsonConvert.DeserializeObject<OrderForm>(jsonStr);
                if (orderInfo != null)
                {
                    var addrJInfo = JsonConvert.DeserializeObject<CustomerDTO>(orderInfo.sendingAddress);
                    var addrSInfo = JsonConvert.DeserializeObject<CustomerDTO>(orderInfo.receivingaddress);

                    var order = new OrderInfo();
                    order.CreateTime = DateTime.Now;
                    order.ExpectTime = DateTime.Parse(orderInfo.pickuptime);
                    order.Goods = orderInfo.goods;
                    order.SupportPrice = double.Parse(orderInfo.insurance);
                    order.Mark = orderInfo.talk;
                    order.Payway = orderInfo.payway;
                    order.Status = 0;
                    order.UniqueId = Guid.NewGuid().ToString();
                    order.WechatId = CurrentLoginUser.ClientID;
                    if (addrJInfo == null)
                        return ModelStateToJsonResult<AjaxResult>((re) => { re.status = false; re.errormessage = "寄件地址有误！"; });
                    //寄件信息
                    order.Csr_Addr_J = addrJInfo.Csr_Addr;
                    order.Csr_AddrDetail_J = addrJInfo.Csr_AddrDetail;
                    order.Csr_Name_J = addrJInfo.Csr_Name;
                    order.Csr_PostCode_J = addrJInfo.Csr_PostCode;
                    order.Csr_Tel_J = addrJInfo.Csr_Tel;
                    order.Csr_UniqueId_J = addrJInfo.UniqueId;
                    if (addrSInfo == null)
                        return ModelStateToJsonResult<AjaxResult>((re) => { re.status = false; re.errormessage = "收件地址有误！"; });
                    //收件信息
                    order.Csr_Addr_S = addrSInfo.Csr_Addr;
                    order.Csr_AddrDetail_S = addrSInfo.Csr_AddrDetail;
                    order.Csr_Name_S = addrSInfo.Csr_Name;
                    order.Csr_PostCode_S = addrSInfo.Csr_PostCode;
                    order.Csr_Tel_S = addrSInfo.Csr_Tel;
                    order.Csr_UniqueId_S = addrSInfo.UniqueId;
                    orderServices.Create(order);
                    return ModelStateToJsonResult<AjaxResult>((result) =>
                    {
                        result.uniqueId = order.UniqueId;
                        result.status = true;
                    });
                }
                else
                {
                    return ModelStateToJsonResult<AjaxResult>((re) => { re.status = false; re.errormessage = "参数有误！"; });
                }
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));

                return ModelStateToJsonResult<AjaxResult>((re) => { re.status = false; re.errormessage = "服务器繁忙，请稍后再试！"; });
            }
        }

        public ActionResult CustomerOrderIndex()
        {
            return View("Index");
        }
        public ActionResult Orders()
        {
            return View();
        }
        public ActionResult OrdersQuery(string condition, int pageNo, int rowCount)
        {
            try
            {
                var temp = new
                {
                    totalCount = orderServices.GetList(condition, condition, "").Count(),
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = orderServices.GetListByPage(condition, condition, "", rowCount, pageNo),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                var temp = new
                {
                    totalCount = 0,
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = new List<OrderInfo>(),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult QueryOrderByWechatId(string condition, int pageNo, int rowCount)
        {
            try
            {
                //CurrentLoginUser.ClientID
                //"okP1KwtHFXKRHTt-2wpa329WAcic"
                var wechatId = CurrentLoginUser.ClientID;
                var temp = new
                {
                    totalCount = orderServices.GetList(condition, condition, wechatId).Count(),
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = orderServices.GetListByPage(condition, condition, wechatId, rowCount, pageNo),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                var temp = new
                {
                    totalCount = 0,
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = new List<OrderInfo>(),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
            
        }
        public ActionResult QueryOrderByOperationId(string condition, int pageNo, int rowCount)
        {
            try
            {
                //CurrentLoginUser.ClientID
                //"okP1KwtHFXKRHTt-2wpa329WAcic"
                var operationId = "okP1KwtHFXKRHTt-2wpa329WAcic";
                var temp = new
                {
                    totalCount = orderServices.GetList(condition, condition, operationId).Count(),
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = orderServices.GetListByPage(condition, condition, operationId, rowCount, pageNo),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                var temp = new
                {
                    totalCount = 0,
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = new List<OrderInfo>(),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult QueryOrderAssgin(string condition, int pageNo, int rowCount)
        {
            try
            {
                //CurrentLoginUser.ClientID
                //"okP1KwtHFXKRHTt-2wpa329WAcic"
                var wechatId = "okP1KwtHFXKRHTt-2wpa329WAcic";
                var temp = new
                {
                    totalCount = orderServices.GetList(condition, condition, wechatId).Count(),
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = orderServices.GetListByPage(condition, condition, wechatId, rowCount, pageNo),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                var temp = new
                {
                    totalCount = 0,
                    pageSize = rowCount,
                    pageIndex = pageNo,
                    result = new List<OrderInfo>(),
                    status = true
                };
                return Json(temp, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult CancelOrder(string uniqueId,string reason)
        {
            try
            {
                orderServices.CancelOrder(uniqueId, reason);
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = true;
                });
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = false;
                    re.errormessage = "服务器繁忙，请稍后再试！";
                });
            }
        }
        public ActionResult DeleteOrder(string uniqueId, string reason)
        {
            try
            {
                orderServices.ChangeOrderStatus(uniqueId, (int)OrderStatus.Cancel, reason);
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = true;
                });
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = false;
                    re.errormessage = "服务器繁忙，请稍后再试！";
                });
            }
        }



        /// <summary>  
        /// DateTime时间格式转换为Unix时间戳格式  
        /// </summary>  
        /// <param name="time"> DateTime时间格式</param>  
        /// <returns>Unix时间戳格式</returns>  
        private int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }
    }
}
