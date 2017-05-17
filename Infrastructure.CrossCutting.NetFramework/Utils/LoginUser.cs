using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.NetFramework.Utils
{
    public class LoginUser
    {
        public string ServicesID { get; set; }
        public string ClientID { get; set; }

        public CustomerDTO Sending { get; set; }
        public CustomerDTO Receiving { get; set; }

    }
    public class CustomerDTO
    {
        /// <summary>
        ///  客户标识
        /// </summary>
        public string UniqueId { get; set; }
        /// <summary>
        ///  客户姓名
        /// </summary>
        public string Csr_Name { get; set; }
        /// <summary>
        ///  联系电话
        /// </summary>
        public string Csr_Tel { get; set; }
        /// <summary>
        ///  省、市、（区/县）
        /// </summary>
        public string Csr_Addr { get; set; }
        /// <summary>
        ///  详细地址
        /// </summary>
        public string Csr_AddrDetail { get; set; }
        /// <summary>
        ///  邮政编码
        /// </summary>
        public string Csr_PostCode { get; set; }
    }
}
