using Domain.ExpressModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.CustomerManagement
{
    public interface ICustomerManagementServices
    {
        /// <summary>
        ///  检查客户信息是否存在
        /// </summary>
        /// <param name="tel">客户电话</param>
        /// <param name="wechatId">微信ID</param>
        /// <returns>返回True/False</returns>
        bool IsExist(string tel,string wechatId);
        /// <summary>
        ///  添加一个客户
        /// </summary>
        /// <param name="customer"></param>
        void Create(CustomerInfo customer);
        /// <summary>
        ///  修改一个客户
        /// </summary>
        /// <param name="customer"></param>
        void Change(CustomerInfo customer);
        /// <summary>
        ///  删除一个客户地址
        /// </summary>
        /// <param name="uniqueId"></param>
        void Delete(string uniqueId);
        /// <summary>
        ///  获取一个客户
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <returns></returns>
        CustomerInfo GetInfo(string uniqueId);
        /// <summary>
        ///  获取客户列表
        /// </summary>
        /// <param name="tel">客户电话</param>
        /// <param name="name">客户姓名</param>
        /// <param name="webchatId">微信号</param>
        /// <returns>客户列表</returns>
        /// <returns>客户列表</returns>
        IEnumerable<CustomerInfo> GetList(string tel, string name, string webchatId, int status = 1);
        /// <summary>
        ///  获取客户列表
        /// </summary>
        /// <param name="tel">客户电话</param>
        /// <param name="name">客户姓名</param>
        /// <param name="webchatId">微信号</param>
        /// <param name="pageSize">一页显示多少条</param>
        /// <param name="pageIndex">第几页</param>
        /// <returns>客户列表</returns>
        IEnumerable<CustomerInfo> GetListByPage(string tel, string name, string webchatId, int pageSize, int pageIndex, int status = 1);
    }
}
