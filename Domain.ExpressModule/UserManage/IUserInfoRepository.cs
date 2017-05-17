using Domain.Core;
using Domain.ExpressModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ExpressModule.UserManage
{
    /// <summary>
    ///  用户信息管理
    /// </summary>
    public interface IUserInfoRepository:IRepository<UserInfo>
    {
        /// <summary>
        ///  登陆验证
        /// </summary>
        /// <param name="name">用户名</param>
        /// <param name="pwd">密码</param>
        /// <returns>返回当前登陆用户信息</returns>
        UserInfo LoginAccount(string name, string pwd);
    }
}
