using Infrastructure.CrossCutting.IoC;
using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Mvc;
using WebChat_Api.Authorize;
using WebChat_Api.Models;

namespace WebChat_Api.Controllers
{
    public class AuthenticationController : BaseController
    {
        //
        // GET: /Authentication/

        public ActionResult Index()
        {
            //验证
            //var echoString = Request["echoStr"];
            //var signature = Request["signature"];
            //var timestamp = Request["timestamp"];
            //var nonce = Request["nonce"];
            //SysLog.Write("验证", string.Format("echoString:{0}, signature:{1}, nonce:{2}", echoString, signature, nonce));
            //if (!string.IsNullOrEmpty(echoString))
            //{
            //    Response.Write(echoString);
            //    Response.End();
            //}
            string weixin = "";
            weixin = WeChat_Util.Instance.GetPostData();//获取xml数据
            //SysLog.Write("验证",weixin);
            if (string.IsNullOrEmpty(weixin))
            { 
                var loginUser = new LoginUser
                {
                    ServicesID = "gh_876fc02b463c",
                    ClientID = "okP1KwtHFXKRHTt-2wpa329WAcic"
                };
                LoginAuth.Instance.SetCookie(JsonConvert.SerializeObject(loginUser));

            }
            //else
            //    SysLog.Write("测试", weixin);
            if (!string.IsNullOrEmpty(weixin))
            {
                this.CurrentLoginUser=WeChat_Util.Instance.InitLoginUser(weixin);
                var retMsg = WeChat_Util.Instance.HandleMsg(weixin);//调用消息适配器
                Response.Write(retMsg);
                Response.End();
            }
            return View();
        }
        public ActionResult ReplyMessage()
        {
            string weixin = "";
            weixin = WeChat_Util.Instance.GetPostData();//获取xml数据
            if (!string.IsNullOrEmpty(weixin))
            {
                var retMsg = WeChat_Util.Instance.HandleMsg(weixin);//调用消息适配器
                Response.Write(retMsg);
                Response.End();
            }
            return View();
        }

        public ActionResult CallBack(string code,string state)
        {
            // appid  wx07973d1c80ac4c18
            //appsecret   fb3b492e8bd2176dd151dcd24be71fe6
            //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
            //"https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code"
            
            //SysLog.Write("oauth2","code:"+code);
            var result = Util.CustWebRequest("https://api.weixin.qq.com/sns/oauth2/access_token", "appid=" + Util.Appid + "&secret=" + Util.Secret + "&code=" + code + "&grant_type=authorization_code");
            //SysLog.Write("oauth2","result:"+result);
            
            //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
           
            var Client = JsonConvert.DeserializeObject<OAuth2Info>(result);
            if(Client!=null)
            {
               var user = new LoginUser {
                   ClientID = Client.openid
               };
               var ustr = JsonConvert.SerializeObject(user);
                LoginAuth.Instance.SetCookie(ustr);

                var cache = Caching.GetCache("access_token");
                //SysLog.Write("系统异常","Cache:"+cache);
                if (cache==null || cache == "")
                {
                    var token = WeChat_Util.Instance.GetToken();
                    if (string.IsNullOrEmpty(token.errcode))
                    {
                        Caching.SetCache("access_token", token.access_token, DateTime.Now.AddSeconds(7000), TimeSpan.Zero);
                        SysLog.Write("系统异常", "access_token:" + token.access_token);
                    }
                }
            }

            return Redirect("/OrderManage/Create");
        }

        public ActionResult ReplyMessageCallBack(string target)
        {
            string result = "";
            result = WeChat_Util.Instance.GetPostData();//获取xml数据
            if (string.IsNullOrEmpty(result))
            {
                SysLog.Write("事件通知返回", "返回结果为空");
            }
            else
                SysLog.Write("事件通知返回", "返回结果："+result);
            
            var Client = JsonConvert.DeserializeObject<TempleteMessage>(result);
            if (Client != null)
            {
                var user = new LoginUser
                {
                    ClientID = Client.FromUserName
                };
                var ustr = JsonConvert.SerializeObject(user);
                LoginAuth.Instance.SetCookie(ustr);

                var cache = Caching.GetCache("access_token");
                if (cache == null || cache == "")
                {
                    var token = WeChat_Util.Instance.GetToken();
                    if (string.IsNullOrEmpty(token.errcode))
                    {
                        Caching.SetCache("access_token", token.access_token, DateTime.Now.AddSeconds(7000), TimeSpan.Zero);
                        SysLog.Write("系统异常", "access_token:" + token.access_token);
                    }
                }
            }

            if (string.IsNullOrEmpty(target))
                return null;
            else
                return Redirect(target);
        }
    }
}
