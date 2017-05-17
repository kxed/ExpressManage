using Domain.ExpressModule.Entities;
using Domain.ExpressModule.UserManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.UserManagement
{
    public class UserManagementServices:IUserManagementServices
    {

        #region Members
        IUserInfoRepository _userInfoRepository;
        #endregion
        #region Constructor
        public UserManagementServices(IUserInfoRepository accountRepository)
        {
            if(accountRepository == null)
                throw new ArgumentNullException("初始化参数IUserInfoRepository不能为空");
            _userInfoRepository = accountRepository;
        }
        #endregion
        #region IUserManagementServices Members
        public void CreateUser(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException("用户信息不能为空");
            _userInfoRepository.Add(userInfo);
            //_userInfoRepository.UnitOfWork.Commit();
            _userInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }

        public void ChangeUser(UserInfo userInfo)
        {
            if (userInfo == null)
                throw new ArgumentNullException("用户信息不能为空");
            _userInfoRepository.Modify(userInfo);
            _userInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }

        public void ChangePassword(string userUnqueid, string oldpwd, string newpwd)
        {
            if (userUnqueid == null || userUnqueid == Guid.Empty.ToString())
                throw new ArgumentNullException("用户编号不能为空");
            if (string.IsNullOrEmpty(oldpwd))
                throw new ArgumentNullException("用户旧密码不能为空");
            if (string.IsNullOrEmpty(newpwd))
                throw new ArgumentNullException("用户新密码不能为空");
            var users = _userInfoRepository.GetFilteredElements(a=>a.UniqueId == userUnqueid);
            if (users != null && users.Any())
            {
                var userInfo = users.FirstOrDefault();
                if (userInfo != null)
                {
                    if(userInfo.UserPwd != oldpwd)
                        throw new SystemException("请输入正确的旧密码");
                    userInfo.UserPwd = newpwd;
                    _userInfoRepository.Modify(userInfo);
                    _userInfoRepository.UnitOfWork.CommitAndRefreshChanges();
                }
                else
                    throw new SystemException("此用户不存在，无法进行密码修改");
            }
            else
                throw new ArgumentNullException("此用户不存在，无法进行密码修改");
        }

        public void ResetPassWord(string userUnqueid)
        {
            _userInfoRepository.ModifyByCondition(a => { a.UserPwd = "123456"; }, a => a.UniqueId == userUnqueid);
            _userInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }

        public IEnumerable<UserInfo> GetUsers()
        {
            return _userInfoRepository.GetAll();
        }
        public UserInfo GetInfo(string uniqueId)
        {
            return _userInfoRepository.GetFilteredElements(a => a.UniqueId == uniqueId).FirstOrDefault();
        }
        public bool LoginAccount(string userName, string pwd)
        {
            UserSpecification spec = new UserSpecification(new UserInfo { UserName = userName.ToLower(), UserPwd = pwd });
            var users = _userInfoRepository.GetBySpec(spec);
            if (users != null && users.Any())
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        #endregion

        #region Disposable Members
        public void Dispose()
        {
            if (_userInfoRepository != (IUserInfoRepository)null)
            {
                this._userInfoRepository
                    .UnitOfWork
                    .Dispose();
            }
        }
        #endregion
    }
}
