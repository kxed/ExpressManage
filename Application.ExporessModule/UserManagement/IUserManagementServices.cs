using Domain.ExpressModule.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.UserManagement
{
    public interface IUserManagementServices
    {
        /// <summary>
        ///  添加用户
        /// </summary>
        /// <param name="userInfo"></param>
        void CreateUser(UserInfo userInfo);

        /// <summary>
        ///  修改用户
        /// </summary>
        /// <param name="userInfo"></param>
        void ChangeUser(UserInfo userInfo);

        /// <summary>
        ///  修改密码
        /// </summary>
        /// <param name="userUnqueid"></param>
        /// <param name="oldpwd"></param>
        /// <param name="newpwd"></param>
        void ChangePassword(string userUnqueid, string oldpwd, string newpwd);
        /// <summary>
        ///  重置密码
        /// </summary>
        /// <param name="userid">用户ID</param>
        void ResetPassWord(string userUnqueid);

        /// <summary>
        ///  获取所有用户
        /// </summary>
        /// <returns></returns>
        IEnumerable<UserInfo> GetUsers();
        /// <summary>
        ///  获取用户信息
        /// </summary>
        /// <param name="uniqueId"></param>
        /// <returns></returns>
        UserInfo GetInfo(string uniqueId);
        /// <summary>
        ///  登陆验证
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        bool LoginAccount(string userName, string pwd);
    }
}
