using Domain.Core.Specification;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.NetFramework.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ExpressModule.UserManage
{
    public class UserSpecification : Specification<UserInfo>
    {
        #region Members
        string _userId = AppConst.StringGUID_DEFAULT;
        string _userName = AppConst.STRING_DEFAULT;
        string _userPwd = AppConst.STRING_DEFAULT;
        string _userTel = AppConst.STRING_DEFAULT;
        string _userPidNo = AppConst.STRING_DEFAULT;
        DateTime? _entyTime = AppConst.DateTimeNull;
        string _userNickName = AppConst.STRING_DEFAULT;
        string _userCode = AppConst.STRING_DEFAULT;
        #endregion

        #region Constructor
        public UserSpecification(UserInfo userInfo)
        {
            _userId = userInfo.UniqueId;
            _userName = userInfo.UserName;
            _userPwd = userInfo.UserPwd;
            _userTel = userInfo.Tel;
            _userPidNo = userInfo.PID;
            _entyTime = userInfo.EntryTime;
            _userNickName = userInfo.UserNickName;
            _userCode = userInfo.UserCode;
        }

        #endregion

        #region Specification overrides
        public override System.Linq.Expressions.Expression<Func<UserInfo, bool>> SatisfiedBy()
        {
            Specification<UserInfo> beginSpec = new TrueSpecification<UserInfo>();
            if (_userId != AppConst.StringGUID_DEFAULT && !string.IsNullOrEmpty(_userId))
                beginSpec &= new DirectSpecification<UserInfo>(a=>a.UniqueId == _userId);
            if(!string.IsNullOrEmpty(_userName))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.UserName == _userName);
            if(!string.IsNullOrEmpty(_userPwd))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.UserPwd == _userPwd);
            if (!string.IsNullOrEmpty(_userTel))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.Tel == _userTel);
            if(!string.IsNullOrEmpty(_userPidNo))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.PID == _userPidNo);
            if (_entyTime != AppConst.DateTimeNull)
                beginSpec &= new DirectSpecification<UserInfo>(a => a.EntryTime == _entyTime);
            if (!string.IsNullOrEmpty(_userNickName))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.UserNickName == _userNickName);
            if (!string.IsNullOrEmpty(_userCode))
                beginSpec &= new DirectSpecification<UserInfo>(a => a.UserCode == _userCode);
            return beginSpec.SatisfiedBy();
        }
        #endregion
    }
}
