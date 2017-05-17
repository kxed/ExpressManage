using Application.ExpressModule.UserManagement;
using Infrastructure.CrossCutting.IoC;
using Infrastructure.CrossCutting.NetFramework.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebChat_Api.Authorize;

namespace WebChat_Api.Controllers
{
    public class UserManageController : BaseController
    {
        //
        // GET: /UserManage/
        IUserManagementServices userServices = IoCFactory.Instance.CurrentContainer.Resolve<IUserManagementServices>();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult CheckLogin(string uname, string pwd)
        {
            try
            {
                var status = userServices.LoginAccount(uname, pwd);
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = status;
                    re.errormessage = "用户名或密码错误";
                    re.redirect = "/Home/Index";
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
    }
}
