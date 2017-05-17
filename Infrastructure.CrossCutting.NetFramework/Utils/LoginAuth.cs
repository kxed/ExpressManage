using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.NetFramework.Utils
{
    public class LoginAuth
    {
        public static readonly LoginAuth Instance = new LoginAuth();
        public static string strCookieKey = "20170511#395";//"22486423#322";
        public static string cookieName = "kx365895#784als";//"x5486423#323sdf";
        public static string strAutoLoginKey = "sql920#$%2d2*&$%#%$";//自动登录加密Key

        LoginAuth()
        {
            //cache = MemcachedClient.GetInstance("MyConfigFileCache");
            //SysId = ConfigurationManager.AppSettings["ThisSysID"];
            //LoginPage = ConfigurationManager.AppSettings["LoginPage"];
            //LoginHowlong = string.IsNullOrEmpty(ConfigurationManager.AppSettings["LoginDateHowlong"]) ? 360 : Convert.ToInt32(ConfigurationManager.AppSettings["LoginDateHowlong"]);

        }
        /// <summary>
        ///  获取当前登录用户
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string CurrentUser()
        {
            string key = GetCookie();
            if (string.IsNullOrEmpty(key))
            {
                return null;
            }
            return key;
        }

        /// <summary>
        ///  把Key写入Cookie
        /// </summary>
        /// <param name="key"></param>
        public void SetCookie(string key)
        {
            System.Web.HttpContext WEBHTTP = System.Web.HttpContext.Current;
            WEBHTTP.Response.Cookies[cookieName].Value = Util.Encrypt(key, strCookieKey);
            WEBHTTP.Session[cookieName] = Util.Encrypt(key, strCookieKey);
        }

        /// <summary>
        ///  获取key
        /// </summary>
        /// <returns></returns>
        private string GetCookie()
        {
            System.Web.HttpContext WEBHTTP = System.Web.HttpContext.Current;
            if (WEBHTTP.Session[cookieName] != null && WEBHTTP.Session[cookieName].ToString() != "")
            {
                return Util.Decrypt(WEBHTTP.Session[cookieName].ToString(), strCookieKey);
            }
            else
            {
                if (WEBHTTP.Request.Cookies[cookieName] != null &&
                    WEBHTTP.Request.Cookies[cookieName].Value != "")
                {
                    return Util.Decrypt(WEBHTTP.Request.Cookies[cookieName].Value, strCookieKey);
                }
                else
                {
                    return null;
                }
            }
        }
    }
}
