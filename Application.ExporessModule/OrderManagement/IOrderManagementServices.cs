using Domain.ExpressModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.OrderManagement
{
    public interface IOrderManagementServices
    {
        /// <summary>
        ///  创建新订单
        /// </summary>
        /// <param name="orderInfo"></param>
        void Create(OrderInfo orderInfo); 
        /// <summary>
        ///  修改订单信息
        /// </summary>
        /// <param name="orderInfo"></param>
        void Change(OrderInfo orderInfo);
        /// <summary>
        ///  修改订单状态
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <param name="status"></param>
        void ChangeOrderStatus(string uniqueId, int status, string remark = "");
        /// <summary>
        ///  取消预约订单
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <param name="remark"></param>
        void CancelOrder(string uniqueId, string remark);
        /// <summary>
        ///  快递员确认订单
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <param name="remark"></param>
        void ConfirmOrder(string uniqueId, string remark);
        /// <summary>
        ///  支付订单
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <param name="remark"></param>
        void PayOrder(string uniqueId,string remark);
        /// <summary>
        ///  获取订单信息
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <returns></returns>
        OrderInfo GetInfo(string uniqueId);
        /// <summary>
        ///  获取订单列表
        /// </summary>
        /// <param name="tel">客户电话</param>
        /// <param name="name">客户姓名</param>
        /// <param name="wechatId">微信ID</param>
        /// <returns>返回订单列表</returns>
        IEnumerable<OrderInfo> GetList(string tel, string name, string wechatId);
        /// <summary>
        ///  获取订单列表按分页方式
        /// </summary>
        /// <param name="tel">客户电话</param>
        /// <param name="name">客户姓名</param>
        /// <param name="wechatId">微信ID</param>
        /// <param name="pageSize">一页显示多少条</param>
        /// <param name="pageIndex">第几页</param>
        /// <returns>返回订单列表</returns>
        IEnumerable<OrderInfo> GetListByPage(string tel, string name, string wechatId, int pageSize, int pageIndex);
    }
}
