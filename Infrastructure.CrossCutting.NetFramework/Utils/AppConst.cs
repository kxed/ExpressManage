using Infrastructure.CrossCutting.NetFramework.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.NetFramework.Utils
{
    public static class AppConst
    {
        public const int INT_DEFAULT = -2;
        public const decimal DECIMAL_DEFAULT = -2;
        public const string STRING_DEFAULT = null;
        public static string StringGUID_DEFAULT = "00000000-0000-0000-0000-000000000000";
        public static Guid GUID_DEFAULT = Guid.Parse("00000000-0000-0000-0000-000000000000");
        public static DateTime DateTimeNull = DateTime.Parse("1900-01-01 00:00:00");
        public static DateTime DateTime_DEFAULT = DateTime.Parse("1900-01-01 00:00:00");
        public const string DateTimeLongFormat = "yyyy-MM-dd HH:mm:ss";
        public const string DateTimeFormat = "yyyy-MM-dd";
        public const string PASSWORD_DEFAULT = "123456";
        public const string DateTimeChineseMonth = "MM月dd日HH时mm分";
    }
}
