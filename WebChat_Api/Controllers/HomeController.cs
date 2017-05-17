using Infrastructure.CrossCutting.NetFramework.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebChat_Api.Authorize;
using WebChat_Api.Models;

namespace WebChat_Api.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            string weixin = "";
            weixin = WeChat_Util.Instance.GetPostData();//获取xml数据
            SysLog.Write("测试", "请求了一次，内容："+weixin);
            if (string.IsNullOrEmpty(weixin))
            {
                //var loginUser = new LoginUser
                //{
                //    ServicesID = "gh_876fc02b463c",
                //    ClientID = "okP1KwtHFXKRHTt-2wpa329WAcic"
                //};
                //LoginAuth.Instance.SetCookie(JsonConvert.SerializeObject(loginUser));

            }
            else
                SysLog.Write("测试", weixin);
            var oppid = "";
            if(!string.IsNullOrEmpty(weixin))
                oppid = WeChat_Util.Instance.GetClientId(weixin);
            if (!string.IsNullOrEmpty(weixin))
            {
               // this.CurrentLoginUser = WeChat_Util.Instance.InitLoginUser(weixin);
                var retMsg = WeChat_Util.Instance.HandleMsg(weixin);//调用消息适配器
                Response.Write(retMsg);
                Response.End();
            }
            ViewBag.oppid = oppid;
            if (!string.IsNullOrEmpty(oppid))
            {
                SysLog.Write("测试", oppid);

                return Redirect("/OrderManage/Create?oppid=" + oppid);
            }
            return View();
        }

    }
}
