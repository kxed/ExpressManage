using Domain.Core.Specification;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.NetFramework.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ExpressModule.OrderManage
{
    public class OrderSecification : Specification<OrderInfo>
    {
        #region Members
        string Csr_Name_J = AppConst.STRING_DEFAULT;
        string Csr_Tel_J = AppConst.STRING_DEFAULT;
        string Csr_Name_S = AppConst.STRING_DEFAULT;
        string Csr_Tel_S = AppConst.STRING_DEFAULT;
        string WaybillNo = AppConst.STRING_DEFAULT;
        int? Status = AppConst.INT_DEFAULT;
        string uniqueId = AppConst.StringGUID_DEFAULT;
        string WechatId = string.Empty;
        #endregion

        #region Constructor
        public OrderSecification(OrderInfo orderInfo)
        {
            Csr_Name_J = orderInfo.Csr_Name_J;
            Csr_Tel_J = orderInfo.Csr_Tel_J;
            Csr_Name_S = orderInfo.Csr_Name_S;
            Csr_Tel_S = orderInfo.Csr_Tel_S;
            WaybillNo = orderInfo.WaybillNo;
            Status = orderInfo.Status;
            uniqueId = orderInfo.UniqueId;
            WechatId = orderInfo.WechatId;
        }
        #endregion

        #region Specification overrides
        public override System.Linq.Expressions.Expression<Func<OrderInfo, bool>> SatisfiedBy()
        {
            Specification<OrderInfo> beginSpec = new TrueSpecification<OrderInfo>();
            if (!string.IsNullOrEmpty(uniqueId))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.UniqueId == uniqueId);
            if (!string.IsNullOrEmpty(WechatId))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.WechatId == WechatId);
            if (!string.IsNullOrEmpty(Csr_Name_J))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.Csr_Name_J == Csr_Name_J);
            if (!string.IsNullOrEmpty(Csr_Tel_J))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.Csr_Tel_J == Csr_Tel_J);
            if (!string.IsNullOrEmpty(Csr_Name_S))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.Csr_Name_S == Csr_Name_S);
            if (!string.IsNullOrEmpty(Csr_Tel_S))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.Csr_Tel_S == Csr_Tel_S);
            if (!string.IsNullOrEmpty(WaybillNo))
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.WaybillNo == WaybillNo);
            if(Status != null)
                beginSpec &= new DirectSpecification<OrderInfo>(a => a.Status == Status);
            return beginSpec.SatisfiedBy();
        }
        #endregion
    }
}
