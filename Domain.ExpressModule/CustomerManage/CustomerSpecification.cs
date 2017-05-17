using Domain.Core.Specification;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.NetFramework.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ExpressModule.CustomerManage
{
    public class CustomerSpecification:Specification<CustomerInfo>
    {
        #region Members
        string _tel = AppConst.STRING_DEFAULT;
        string _name = AppConst.STRING_DEFAULT;
        string _wechatId = AppConst.STRING_DEFAULT;
        string _uniqueId = AppConst.StringGUID_DEFAULT;
        int? _status = AppConst.INT_DEFAULT;
        #endregion

        #region Constructor
        public CustomerSpecification(CustomerInfo customer)
        {
            _tel = customer.Csr_Tel;
            _name = customer.Csr_Name;
            _wechatId = customer.WeChat_Id;
            _uniqueId = customer.UniqueId;
            _status = customer.Status;
        }
        #endregion

        #region Specification override
        public override System.Linq.Expressions.Expression<Func<CustomerInfo, bool>> SatisfiedBy()
        {
            Specification<CustomerInfo> beginSpec = new TrueSpecification<CustomerInfo>();
            OrSpecification<CustomerInfo> orMainSpec;
            DirectSpecification<CustomerInfo> nameSpec = null;
            DirectSpecification<CustomerInfo> telSpec = null;
            if (_status !=null)
                beginSpec &= new DirectSpecification<CustomerInfo>(a => a.Status == _status);
            if (!string.IsNullOrEmpty(_wechatId))
                beginSpec &= new DirectSpecification<CustomerInfo>(a => a.WeChat_Id == _wechatId);
            if (_uniqueId != AppConst.StringGUID_DEFAULT && !string.IsNullOrEmpty(_uniqueId))
                beginSpec &= new DirectSpecification<CustomerInfo>(a => a.UniqueId == _uniqueId);
            if (!string.IsNullOrEmpty(_tel))
                telSpec = new DirectSpecification<CustomerInfo>(a => a.Csr_Tel.Contains(_tel));
            if (!string.IsNullOrEmpty(_name))
                nameSpec = new DirectSpecification<CustomerInfo>(a => a.Csr_Name.Contains(_name));
            if (nameSpec != null && telSpec != null)
            {
                orMainSpec = new OrSpecification<CustomerInfo>(nameSpec, telSpec);

                beginSpec &= orMainSpec;
            }
            else
            {
                if (nameSpec != null)
                    beginSpec &= nameSpec;
                if (telSpec != null)
                    beginSpec &= telSpec;
            }

            return beginSpec.SatisfiedBy();
        }
        #endregion
    }
}
