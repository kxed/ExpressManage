using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;

namespace Domain.ExpressModule.Entities
{
    public enum OrderStatus
    {
        [Description("已删除")]
        Delete = -2,
        [Description("已取消")]
        Cancel = -1,
        [Description("待取件")]
        StayTake = 0,
        [Description("待付款")]
        StayPay = 1,
        [Description("已付款")]
        Payed = 2,
        [Description("投递中")]
        InDelivery = 3,
        [Description("已签收")]
        Finished = 4
    }
}
