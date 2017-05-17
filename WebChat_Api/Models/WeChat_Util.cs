using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;

namespace WebChat_Api.Models
{
    public class WeChat_Util
    {
        public static readonly WeChat_Util Instance = new WeChat_Util();

        public Access_token GetToken()
        {
            var tokenResult = Util.CustWebRequest("https://api.weixin.qq.com/cgi-bin/token", "grant_type=client_credential&appid="+Util.Appid+"&secret="+Util.Secret);
            //SysLog.Write("系统异常", "请求地址：https://api.weixin.qq.com/cgi-bin/token" + "grant_type=client_credential&appid=" + Util.Appid + "&secret=" + Util.Secret);
            return JsonConvert.DeserializeObject<Access_token>(tokenResult);
        }

        /// <summary>
        ///  获取到Post的内容
        /// </summary>
        /// <returns></returns>
        public string GetPostData(){
            Stream s = System.Web.HttpContext.Current.Request.InputStream;
            byte[] b = new byte[s.Length];
            s.Read(b, 0, (int)s.Length);
            return Encoding.UTF8.GetString(b);
        }
        private Message GetExmlMsg(XmlElement root)
        {
            Message xmlMsg = new Message()
            {
                FromUserName = root.SelectSingleNode("FromUserName").InnerText,
                ToUserName = root.SelectSingleNode("ToUserName").InnerText,
                CreateTime = root.SelectSingleNode("CreateTime").InnerText,
                MsgType = root.SelectSingleNode("MsgType").InnerText,
            };
            return xmlMsg;
        }
        public string GetClientId(string message)
        {
            //SysLog.Write("测试","M : "+ message);
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(message);//读取xml字符串
            XmlElement root = doc.DocumentElement;
            //获取操作人信息
            var fromUserName = root.SelectSingleNode("FromUserName").InnerText;
            var toUserName = root.SelectSingleNode("ToUserName").InnerText;
            return fromUserName;
        }
        public LoginUser InitLoginUser(string message)
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(message);//读取xml字符串
            XmlElement root = doc.DocumentElement;
            //获取操作人信息
            var fromUserName = root.SelectSingleNode("FromUserName").InnerText;
            var toUserName = root.SelectSingleNode("ToUserName").InnerText;
            return  new LoginUser
            {
                ServicesID = toUserName,
                ClientID = fromUserName
            };
        }
        /// <summary>
        /// 从XML字符串中反序列化对象
        /// </summary>
        /// <typeparam name="T">结果对象类型</typeparam>
        /// <param name="s">包含对象的XML字符串</param>
        /// <param name="encoding">编码方式</param>
        /// <returns>反序列化得到的对象</returns>
        public T XmlDeserialize<T>(string s, Encoding encoding)
        {
            if (string.IsNullOrEmpty(s))
                throw new ArgumentNullException("s");
            if (encoding == null)
                throw new ArgumentNullException("encoding");
            XmlDocument xdoc = new XmlDocument();
            Type t = typeof(T);
            s = s.Replace("<xml>", "<" + t.Name + ">");
            s = s.Replace("</xml>", "</" + t.Name + ">");
            //xdoc.LoadXml(s);
            //XmlNodeReader reader = new XmlNodeReader(xdoc.DocumentElement);
            //XmlSerializer ser = new XmlSerializer(typeof(T));
            //object obj = ser.Deserialize(reader);
            //return (T)obj;  
            XmlSerializer mySerializer = new XmlSerializer(typeof(T));
            using (MemoryStream ms = new MemoryStream(encoding.GetBytes(s)))
            {
                using (StreamReader sr = new StreamReader(ms, encoding))
                {
                    return (T)mySerializer.Deserialize(sr);
                }
            }
        }
        public string HandleMsg(string message)// 服务器响应微信请求
        {
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(message);//读取xml字符串
            XmlElement root = doc.DocumentElement;
            
            XmlNode MsgType = root.SelectSingleNode("MsgType");
            //获取操作人信息
            var fromUserName = root.SelectSingleNode("FromUserName").InnerText;
            var toUserName = root.SelectSingleNode("ToUserName").InnerText;
            var loginUser = new LoginUser
            {
                ServicesID = toUserName,
                ClientID = fromUserName
            };
            LoginAuth.Instance.SetCookie(JsonConvert.SerializeObject(loginUser));
            string messageType = MsgType.InnerText;
            //SysLog.Write("测试", messageType);
            //Message xmlMsg = GetExmlMsg(root);
            //string messageType = xmlMsg.MsgType;//获取收到的消息类型。文本(text)，图片(image)，语音等。
            string returnMessage = string.Empty;

            try
            {
                switch (messageType)
                {
                    //当消息为文本时
                    case "text":
                        var textMessage = XmlDeserialize<TextMessage>(message,Encoding.UTF8);
                        returnMessage = textCase(textMessage);
                        break;
                    case "event":
                        var eventMessage = XmlDeserialize<EventMessage>(message, Encoding.UTF8);
                        if (!string.IsNullOrEmpty(eventMessage.Event) && eventMessage.Event.Trim() == "subscribe")
                        {
                            //刚关注时的时间，用于欢迎词  
                            int nowtime = ConvertDateTimeInt(DateTime.Now);
                            string msg = "感谢关注百世快递源汇区分店！";
                            returnMessage = "<xml><ToUserName><![CDATA[" + eventMessage.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + eventMessage.ToUserName + "]]></FromUserName><CreateTime>" + nowtime + "</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[" + msg + "]]></Content><FuncFlag>0</FuncFlag></xml>";
                        }
                        break;
                    case "image":
                        break;
                    case "voice":
                        break;
                    case "vedio":
                        break;
                    case "location":
                        break;
                    case "link":
                        break;
                    default:
                        break;
                }
                return returnMessage;
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，事件捕捉，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                return returnMessage;
            }
        }
        private string getText(TextMessage message)
        {
            System.Text.StringBuilder retsb = new StringBuilder(200);
            retsb.Append("我不懂你再说什么啊！\r\n( >﹏<。)～呜呜呜……\r\n我还正在努力学习中……");
            //retsb.Append("接收到的消息：" + message.Content);
            //retsb.Append("用户的OPEANID：" + message.FromUserName);

            return retsb.ToString();
        }


        #region 操作文本消息 + void textCase(XmlElement root)
        private string textCase(TextMessage message)
        {
            int nowtime = ConvertDateTimeInt(DateTime.Now);
            string msg = "";
            msg = getText(message);
            return "<xml><ToUserName><![CDATA[" + message.FromUserName + "]]></ToUserName><FromUserName><![CDATA[" + message.ToUserName + "]]></FromUserName><CreateTime>" + nowtime + "</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[" + msg + "]]></Content><FuncFlag>0</FuncFlag></xml>";
        }
        #endregion

        #region 将datetime.now 转换为 int类型的秒
        /// <summary>
        /// datetime转换为unixtime
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        private int ConvertDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }
        private int converDateTimeInt(System.DateTime time)
        {
            System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
            return (int)(time - startTime).TotalSeconds;
        }

        /// <summary>
        /// unix时间转换为datetime
        /// </summary>
        /// <param name="timeStamp"></param>
        /// <returns></returns>
        private DateTime UnixTimeToTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000000");
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        }
        #endregion

        #region 验证微信签名 保持默认即可
        /// <summary>
        /// 验证微信签名
        /// </summary>
        /// * 将token、timestamp、nonce三个参数进行字典序排序
        /// * 将三个参数字符串拼接成一个字符串进行sha1加密
        /// * 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信。
        /// <returns></returns>
        //private bool CheckSignature()
        //{
        //    string signature = Request.QueryString["signature"].ToString();
        //    string timestamp = Request.QueryString["timestamp"].ToString();
        //    string nonce = Request.QueryString["nonce"].ToString();
        //    string[] ArrTmp = { Token, timestamp, nonce };
        //    Array.Sort(ArrTmp);     //字典排序
        //    string tmpStr = string.Join("", ArrTmp);
        //    tmpStr = FormsAuthentication.HashPasswordForStoringInConfigFile(tmpStr, "SHA1");
        //    tmpStr = tmpStr.ToLower();
        //    if (tmpStr == signature)
        //    {
        //        return true;
        //    }
        //    else
        //    {
        //        return false;
        //    }
        //}

        //private void Valid()
        //{
        //    string echoStr = Request.QueryString["echoStr"].ToString();
        //    if (CheckSignature())
        //    {
        //        if (!string.IsNullOrEmpty(echoStr))
        //        {
        //            Response.Write(echoStr);
        //            Response.End();
        //        }
        //    }
        //}
        #endregion

        //public static void ReGetOpenId()
        //{
        //    string url = System.Web.HttpContext.Current.Request.Url.AbsoluteUri;//获取当前url
        //    if (System.Web.HttpContext.Current.Session["openid"] == "" || System.Web.HttpContext.Current.Session["openid"] == null)
        //    {
        //        //先要判断是否是获取code后跳转过来的
        //        if (System.Web.HttpContext.Current.Request.QueryString["code"] == "" || System.Web.HttpContext.Current.Request.QueryString["code"] == null)
        //        {
        //            //Code为空时，先获取Code
        //            string GetCodeUrls = GetCodeUrl(url);
        //            System.Web.HttpContext.Current.Response.Redirect(GetCodeUrls);//先跳转到微信的服务器，取得code后会跳回来这页面的

        //        }
        //        else
        //        {
        //            //Code非空，已经获取了code后跳回来啦，现在重新获取openid
        //            string openid = "";
        //            openid = GetOauthAccessOpenId(System.Web.HttpContext.Current.Request.QueryString["Code"]);//重新取得用户的openid
        //            System.Web.HttpContext.Current.Session["openid"] = openid;
        //        }
        //    }
        //}

        ///// <summary>重新获取Code,以后面实现带着Code重新跳回目标页面(没有用户授权的，只能获取基本信息（openid））</summary>
        ///// <param name="url">目标页面</param>
        ///// <returns></returns>
        //public static string GetCodeUrl(string url)
        //{
        //    string CodeUrl = "";
        //    //对url进行编码
        //    url = System.Web.HttpUtility.UrlEncode(url);
        //    CodeUrl = string.Format("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + Appid + "&redirect_uri=" + url + "?action=viewtest&response_type=code&scope=snsapi_base&state=1#wechat_redirect");

        //    return CodeUrl;

        //}
        ///// <summary>根据Code获取用户的openid、access_token</summary>
        //public static string GetOauthAccessOpenId(string code)
        //{
        //    string Openid = "";
        //    string url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + Appid + "&secret=" + Secret + "&code=" + code + "&grant_type=authorization_code";
        //    string gethtml = MyHttpHelper.HttpGet(url);
        //    log.log("拿到的url是：" + url);
        //    log.log("获取到的gethtml是" + gethtml);
        //    OAuth_Token ac = new OAuth_Token();
        //    ac = JsonHelper.ToObject<OAuth_Token>(gethtml);
        //    log.log("能否从html里拿到openid=" + ac.openid);
        //    Openid = ac.openid;
        //    return Openid;
        //}
    }
    public class Access_token : WeChat_Result
    {
        public string access_token { get; set; }
        public string expires_in { get; set; }
    }
    public class MessageReturn:WeChat_Result
    {
        public string msgid { get; set; }
    }
    public class WeChat_Result
    {
        public string errcode { get; set; }
        public string errmsg { get; set; }

    }
    public class OAuth2Info
    {
        public string access_token { get; set; }
        public string expires_in { get; set; }
        public string refresh_token { get; set; }
        public string openid { get; set; }
        public string scope { get; set; }
    }
    public class CC_Result
    {
        private bool _rs = false;
        /// <summary>
        ///  是否成功
        /// </summary>
        public bool RS
        {
            get { return _rs; }
            set { _rs = value; }
        }
        /// <summary>
        ///  消息信息
        /// </summary>
        public string Msg { get; set; }

        /// <summary>
        ///  跳转地址
        /// </summary>
        public string TargetUrl { get; set; }
    }
    [Serializable]
     public sealed class WeChatTemplatecsMsg
     {
         public string touser { get; set; }
         public string template_id { get; set; }
         public string topcolor { get; set; }
         public string url { get; set; }
         public Dictionary<string, MessageData> data { get; set; }
     }
 
     [Serializable]
     public sealed class MessageData
     {
         public string value { get; set; }
         private string _color = "#1C86EE";
         public string color { get; set; }
     }
}
