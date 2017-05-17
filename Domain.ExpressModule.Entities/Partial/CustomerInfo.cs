using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.ExpressModule.Entities
{
    public partial class CustomerInfo
    {
        /// <summary>
        ///  操作类型
        /// </summary>
        public string OperationType { get; set; }
        /// <summary>
        ///  客户类型
        /// </summary>
        public string CustomerType { get; set; }
    }
}
