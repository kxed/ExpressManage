using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebChat_Api.Models
{
    public class OrderForm
    {
        public string sendingAddress { get; set; }
        public string receivingaddress { get; set; }
        public string pickuptime { get; set; }
        public string payway { get; set; }
        public string goods { get; set; }
        public string insurance { get; set; }
        public string talk { get; set; }
    }
}