using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.NetFramework.Utils
{
    public class SysLog
    {
        // 得到当前服务器路径
        private static string logPath = string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["logInfo"]) ? AppDomain.CurrentDomain.BaseDirectory : System.Configuration.ConfigurationManager.AppSettings["logInfo"] + @"/SystemLogs/";

        public SysLog()
        {

        }
        public SysLog(string LogPath)
        {
            logPath = LogPath;
        }

        public static string FloderPath
        {
            get
            {
                return logPath;
            }
            set
            {
                logPath = value;
            }
        }

        private static object lockHelper = new object();
        #region Write/Read
        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="LogType">日志类型</param>
        /// <param name="Strings">消息</param>
        public static bool Write(string LogType, string str)
        {
            //string fileName = LogType + "-" + DateTime.Now.ToString("yyyy_MM_dd") + ".log";
            if (!System.IO.Directory.Exists(FloderPath))
            {
                System.IO.Directory.CreateDirectory(FloderPath);
            }
            return Write(LogType, str, "utf-8");
        }
        /// <summary>
        /// 写日志gb2312 UTF-8
        /// </summary>
        /// <param name="LogType">日志类型</param>
        /// <param name="str">消息</param>
        /// <param name="encoding">编码gb2312 UTF-8</param>
        public static bool Write(string LogType, string str, string encoding)
        {
            if (!System.IO.Directory.Exists(FloderPath))
            {
                System.IO.Directory.CreateDirectory(FloderPath);
            }
            string fileName = LogType + "-" + DateTime.Now.ToString("yyyy_MM_dd") + ".log";
            bool _isTrue = false;
            lock (lockHelper)
            {
                System.IO.FileStream f = null;
                System.IO.StreamWriter f2 = null;
                try
                {
                    if (!System.IO.File.Exists(logPath + fileName)) { f = System.IO.File.Create(logPath + fileName); f.Close(); f.Dispose(); f = null; }
                    f2 = new System.IO.StreamWriter(logPath + fileName, true, System.Text.Encoding.GetEncoding(encoding));
                    f2.WriteLine("----------------------------------------header-------------------------------------");
                    f2.WriteLine(str);
                    f2.WriteLine("----------------------------------------footer-------------------------------------");
                    _isTrue = true;
                }
                catch { }
                finally
                {
                    if (f != null) { f.Close(); f.Dispose(); f = null; }
                    if (f2 != null) { f2.Close(); f2.Dispose(); f2 = null; }
                }
            }
            return _isTrue;
        }
        /// <summary>
        /// 读取文件中的内容
        /// </summary>
        /// <param name="fileName">文件</param>
        /// <param name="encoding">编码gb2312 UTF-8</param>
        /// <returns>ArrayList</returns>
        public static ArrayList Read(string fileName, string encoding)
        {
            string lineText = null; ArrayList txtTextArr = new ArrayList();
            if (!File.Exists(logPath + fileName)) { txtTextArr = null; return txtTextArr; }

            lock (lockHelper)
            {
                StreamReader reader = encoding.Equals("") ? new StreamReader(logPath + fileName) : new StreamReader(logPath + fileName, System.Text.Encoding.GetEncoding(encoding));
                while ((lineText = reader.ReadLine()) != null)
                {
                    txtTextArr.Add(lineText);
                }

                reader.Close();
                reader.Dispose();
            }
            return txtTextArr;
        }
        /// <summary>
        /// 读取指定文件内容
        /// </summary>
        /// <param name="fileName">文件路径</param>
        /// <param name="encoding">编码</param>
        /// <returns></returns>
        public static StringBuilder ReadFile(string fileName, string encoding)
        {
            string lineText = null; StringBuilder txtTextArr = new StringBuilder();
            if (!File.Exists(logPath + fileName)) { txtTextArr = null; return txtTextArr; }

            lock (lockHelper)
            {
                StreamReader reader = encoding.Equals("") ? new StreamReader(logPath + fileName) : new StreamReader(logPath + fileName, System.Text.Encoding.GetEncoding(encoding));
                while ((lineText = reader.ReadLine()) != null)
                {
                    txtTextArr.Append(lineText + Environment.NewLine);
                }

                reader.Close();
                reader.Dispose();
            }
            return txtTextArr;
        }
        #endregion
    }
}
