using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebChat_Api.Authorize;
using WebChat_Api.Models;

namespace WebChat_Api.Filters
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class NotificationAttribute : ActionFilterAttribute
    {
        private string _failedFlag;
        private string _validaParams;
        private NotigicationType _notigcationType;
        private OrderForm order = null;
        public LoginUser CurrentLoginUser
        {
            get
            {
                var userInfo = LoginAuth.Instance.CurrentUser();
                if (!string.IsNullOrEmpty(userInfo))
                    return JsonConvert.DeserializeObject<LoginUser>(userInfo);
                else
                    return null;
            }
        }
        public NotificationAttribute(NotigicationType notigcationType, string validaParams)
        {
            _validaParams = validaParams;
            _notigcationType = notigcationType;
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                CC_Result ret = ValidateParams(filterContext);
                if (ret.RS)
                {
                    //继续执行方法
                }
                else
                    filterContext.Result = new JsonResult { Data = ret };
            }
            catch (Exception ex)
            {
                filterContext.Result = new JsonResult { Data = new CC_Result { RS = false, Msg = "参数错误，在操作日志记录" } };
            }
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            if (IsSuccessReturn(filterContext))
            {
                try
                {
                    //tLvswWyYgNFKsZBWKf_zK70ZOK6QjohBBeEAZuCa0Pg
                    var cache = Caching.GetCache("access_token");

                    if (cache == null || cache == "")
                    {
                        var token = WeChat_Util.Instance.GetToken();
                        if (string.IsNullOrEmpty(token.errcode))
                        {
                            Caching.SetCache("access_token", token.access_token, DateTime.Now.AddSeconds(7000), TimeSpan.Zero);
                            var tem = new WeChatTemplatecsMsg()
                            {
                                touser = this.CurrentLoginUser.ClientID,
                                template_id = "5Jb1WzFURFbhZCEL4AsxyH7bvQmtqUKVbM4jatymy4A",
                                url = "http://luohe.imwork.net/Authentication/ReplyMessageCallBack?target=/OrderManage/CustomerOrderIndex",
                                data = new Dictionary<string, MessageData>
                                    {   
                                        {"first", new MessageData { value = "尊敬的客户：" } },
                                        {"keyword1",new MessageData{value="我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。"}},
                                        {"keyword2", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
                                        {"keyword3", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
                                        {"remark", new MessageData{ value = "感谢您的使用。" }}
                                    }
                            };
                            var result = Util.CustWebRequest("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token.access_token, JsonConvert.SerializeObject(tem));
                            var r = JsonConvert.DeserializeObject<MessageReturn>(result);
                            if (r.errmsg != "ok")
                            {
                                SysLog.Write("系统异常", string.Format("异常信息，推送消息失败，失败错误代码：{0}，错误消息：{1}", r.errcode, r.errmsg));
                            }
                        }
                        else
                        {
                            SysLog.Write("系统异常", string.Format("异常信息，获取token失败错误代码：{0}，错误消息：{1}",token.errcode,token.errmsg));
                        }
                    }
                    else
                    {
                        var tem = new WeChatTemplatecsMsg()
                        {
                            touser = this.CurrentLoginUser.ClientID,
                            template_id = "5Jb1WzFURFbhZCEL4AsxyH7bvQmtqUKVbM4jatymy4A",
                            url = "http://luohe.imwork.net/Authentication/ReplyMessageCallBack?target=/OrderManage/CustomerOrderIndex",
                            data = new Dictionary<string, MessageData>
                                    {   
                                        {"first", new MessageData { value = "尊敬的客户：" } },
                                        {"keyword1",new MessageData{value="我们已经接到您的订单，我们会尽快为您分配上门取件的小哥，耐心等待哦。"}},
                                        {"keyword2", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
                                        {"keyword3", new MessageData{ value = DateTime.Now.ToString(AppConst.DateTimeChineseMonth) }},
                                        {"remark", new MessageData{ value = "感谢您的使用。" }}
                                    }
                        };
                        var result = Util.CustWebRequest("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + cache.ToString(), JsonConvert.SerializeObject(tem));
                        var r = JsonConvert.DeserializeObject<MessageReturn>(result);
                        if (r.errmsg != "ok")
                        {
                            SysLog.Write("系统异常", string.Format("异常信息，推送消息失败，失败错误代码：{0}，错误消息：{1}", r.errcode, r.errmsg));
                        }
                    }
                }
                catch (Exception ex)
                {
                    //记录错误日志
                }
            }
        }
        protected CC_Result ValidateParams(ActionExecutingContext filterContext)
        {
            var paramInfo = filterContext.ActionParameters[_validaParams];
            CC_Result result = new CC_Result();
            result.Msg = "参数错误";
            if(_notigcationType == NotigicationType.SubmitOrder)
            {
                try
                {
                    order = JsonConvert.DeserializeObject<OrderForm>(paramInfo.ToString());
                    result.RS = true;
                }
                catch (Exception ex)
                {
                    result.RS = false;
                }

            }
            return result;
        }
        protected virtual bool IsSuccessReturn(ActionExecutedContext filterContext)
        {
            if (filterContext.Result is EmptyResult)
                return "" != _failedFlag;
            else if (filterContext.Result is JsonResult)
            {
                var jsonResult = ((JsonResult)filterContext.Result).Data;

                return Convert.ToBoolean(jsonResult.GetType().GetProperty("status").GetValue(jsonResult));
            }
            else if (filterContext.Result is RedirectToRouteResult)
            {
            }
            string result = filterContext.Result is EmptyResult ? "" : ((ContentResult)filterContext.Result).Content;
            return result.Trim() != _failedFlag;
        }
    }
    public enum NotigicationType
    {
        [Description("提交订单")]
        SubmitOrder = 1
    }
}