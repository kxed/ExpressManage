using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebChat_Api.Models
{
    [Serializable] 
    public class Message
    {
        /// <summary>
        ///  开发者微信账号
        /// </summary>
        public string ToUserName { get; set; }
        /// <summary>
        ///  发送方账号（一个OpenID）
        /// </summary>
        public string FromUserName { get; set; }
        /// <summary>
        ///  消息创建时间 （整型）
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        ///  消息类型（地理消息为 event ）
        /// </summary>
        public string MsgType { get; set; }
        /// <summary>
        ///  事件类型，有ENTER(进入会话)和LOCATION(地理位置)
        /// </summary>
        public string Event { get; set; }
    }
    /// <summary>
    ///  模板消息
    /// </summary>
    [Serializable]
    public class TempleteMessage:Message
    {
        /// <summary>
        ///  消息id（消息id，64位整型）
        /// </summary>
        public long MsgId { get; set; }
        /// <summary>
        ///  状态
        /// </summary>
        public string Status { get; set; }
    }
    /// <summary>
    ///  普通消息
    /// </summary>
    [Serializable]
    public class TextMessage : Message
    {
        /// <summary>
        ///  消息内容
        /// </summary>
        public string Content { get; set; }
    }
    /// <summary>
    ///  事件消息
    /// </summary>
    [Serializable]
    public class EventMessage : Message
    {
        /// <summary>
        ///  地理位置维度，事件类型为LOCATION的时存在
        /// </summary>
        public string Latitude { get; set; }
        /// <summary>
        ///  地理位置经度，事件类型为LOCATION的时存在
        /// </summary>
        public string Longitude { get; set; }
        /// <summary>
        ///  地理位置精度，事件类型为LOCATION的时存在
        /// </summary>
        public string Precision { get; set; }
    }
}