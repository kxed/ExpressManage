using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.NetFramework.Utils
{
    public class Util
    {
        #region 加密过程
        /// <summary>
        /// DEC 加密过程
        /// </summary>
        /// <param name="pToEncrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public static string Encrypt(string pToEncrypt, string sKey)
        {
            if (sKey.Length > 8)
            {
                sKey = sKey.Substring(0, 8);
            }
            if (sKey.Length < 8)
            {
                for (int i = 0; i < 8 - sKey.Length; i++)
                {
                    sKey = sKey + "a";
                }
            }
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();//把字符串放到byte数组中

            byte[] inputByteArray = Encoding.ASCII.GetBytes(pToEncrypt);

            des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);//建立加密对象的密钥和偏移量
            des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);//原文使用ASCIIEncoding.ASCII方法的GetBytes方法
            MemoryStream ms = new MemoryStream();//使得输入密码必须输入英文文本
            CryptoStream cs = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);

            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            StringBuilder ret = new StringBuilder();
            foreach (byte b in ms.ToArray())
            {
                ret.AppendFormat("{0:X2}", b);
            }
            ret.ToString();
            return ret.ToString();
        }
        #endregion

        #region 解密过程
        /// <summary>
        ///  DEC 解密过程
        /// </summary>
        /// <param name="pToDecrypt"></param>
        /// <param name="sKey"></param>
        /// <returns></returns>
        public static string Decrypt(string pToDecrypt, string sKey)
        {
            if (sKey.Length > 8)
            {
                sKey = sKey.Substring(0, 8);
            }
            if (sKey.Length < 8)
            {
                for (int i = 0; i < 8 - sKey.Length; i++)
                {
                    sKey = sKey + "a";
                }
            }
            DESCryptoServiceProvider des = new DESCryptoServiceProvider();
            byte[] inputByteArray = new byte[pToDecrypt.Length / 2];
            for (int x = 0; x < pToDecrypt.Length / 2; x++)
            {
                int i = (Convert.ToInt32(pToDecrypt.Substring(x * 2, 2), 16));
                inputByteArray[x] = (byte)i;
            }

            des.Key = ASCIIEncoding.ASCII.GetBytes(sKey);//建立加密对象的密钥和偏移量，此值重要，不能修改
            des.IV = ASCIIEncoding.ASCII.GetBytes(sKey);
            MemoryStream ms = new MemoryStream();
            CryptoStream cs = new CryptoStream(ms, des.CreateDecryptor(), CryptoStreamMode.Write);

            cs.Write(inputByteArray, 0, inputByteArray.Length);
            cs.FlushFinalBlock();

            StringBuilder ret = new StringBuilder();//建立StringBuilder对象，CreateDecrypt使用的是流对象，必须把解密后的文本变成流对象

            return System.Text.Encoding.ASCII.GetString(ms.ToArray());
        }
        #endregion


        #region 加密，解密方法
        //详细参考http://www.cnblogs.com/JimmyZhang/archive/2008/10/02/Cryptograph.html
        private static ICryptoTransform encryptor;     // 加密器对象
        private static ICryptoTransform decryptor;     // 解密器对象

        private static SymmetricAlgorithm provider = SymmetricAlgorithm.Create("TripleDES");

        private const int BufferSize = 1024;


        /// <summary>
        /// 加密算法
        /// </summary>
        /// <param name="key">密钥：为24或16位字符</param>
        /// <param name="encryptText">被加密的字符串</param>
        /// <returns></returns>
        public static string EncryptNew(string key, string encryptText)
        {
            provider.IV = new byte[] { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            provider.Key = Encoding.UTF8.GetBytes(key);

            encryptor = provider.CreateEncryptor();
            // 创建明文流
            byte[] clearBuffer = Encoding.UTF8.GetBytes(encryptText);
            MemoryStream clearStream = new MemoryStream(clearBuffer);

            // 创建空的密文流
            MemoryStream encryptedStream = new MemoryStream();

            CryptoStream cryptoStream =
                new CryptoStream(encryptedStream, encryptor, CryptoStreamMode.Write);

            // 将明文流写入到buffer中
            // 将buffer中的数据写入到cryptoStream中
            int bytesRead = 0;
            byte[] buffer = new byte[BufferSize];
            do
            {
                bytesRead = clearStream.Read(buffer, 0, BufferSize);
                cryptoStream.Write(buffer, 0, bytesRead);
            } while (bytesRead > 0);

            cryptoStream.FlushFinalBlock();

            // 获取加密后的文本
            buffer = encryptedStream.ToArray();
            string encryptedText = Convert.ToBase64String(buffer);
            return encryptedText;
        }

        // 解密算法
        /// <summary>
        /// </summary>
        /// <param name="key">密钥:为24或16位字符</param>
        /// <param name="decryptedText">被解密的字符串</param>
        /// <returns></returns>
        public static string DecryptNew(string key, string decryptedText)
        {
            provider.IV = new byte[] { 0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF };
            provider.Key = Encoding.UTF8.GetBytes(key);

            decryptor = provider.CreateDecryptor();
            byte[] encryptedBuffer = Convert.FromBase64String(decryptedText);
            Stream encryptedStream = new MemoryStream(encryptedBuffer);

            MemoryStream clearStream = new MemoryStream();
            CryptoStream cryptoStream =
                new CryptoStream(encryptedStream, decryptor, CryptoStreamMode.Read);

            int bytesRead = 0;
            byte[] buffer = new byte[BufferSize];

            do
            {
                bytesRead = cryptoStream.Read(buffer, 0, BufferSize);
                clearStream.Write(buffer, 0, bytesRead);
            } while (bytesRead > 0);

            buffer = clearStream.GetBuffer();
            string clearText =
                Encoding.UTF8.GetString(buffer, 0, (int)clearStream.Length);

            return clearText;
        }


        #endregion

        public static string GetAppSettingByKey(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }
        public static string Appid
        {
            get{
                return GetAppSettingByKey("appid");
            }
            
        }
        public static string Secret
        {
            get{
                return GetAppSettingByKey("secret");
            }
            
        }

        /// <summary>
        ///  Web请求
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="recData">参数当为GET请求时可为空</param>
        /// <param name="encoding">编码格式默认为“UTF-8”</param>
        /// <returns>返回字符串json格式</returns>
        public static string CustWebRequest(string url, string recData="", string encoding = "UTF-8", string reqTyp = "POST", string contentType = "application/x-www-form-urlencoded")
        {
            encoding = string.IsNullOrEmpty(encoding) ? "UTF-8" : encoding;

            //   准备请求...  
            byte[] data = System.Text.Encoding.GetEncoding(encoding).GetBytes(recData);
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = string.IsNullOrEmpty(reqTyp) ? "POST" : reqTyp;
            if (req.Method == "POST")
            {
                req.ContentType = contentType;
                //req.ContentLength = recData.Length;

                Stream stream = req.GetRequestStream();
                //   发送数据  
                stream.Write(data, 0, data.Length);
                stream.Close();
            }

            HttpWebResponse rep = (HttpWebResponse)req.GetResponse();
            Stream receiveStream = rep.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding(encoding);
            StreamReader readStream = new StreamReader(receiveStream, encode);

            Char[] read = new Char[256];
            int count = readStream.Read(read, 0, 256);
            StringBuilder sb = new StringBuilder("");
            while (count > 0)
            {
                String readstr = new String(read, 0, count);
                sb.Append(readstr);
                count = readStream.Read(read, 0, 256);
            }

            rep.Close();
            readStream.Close();
            var response = sb.ToString();
            return response;
        }
        ///// <summary>
        /////  Web请求
        ///// </summary>
        ///// <param name="url">请求地址</param>
        ///// <param name="recData">参数</param>
        ///// <param name="encoding">编码格式默认为“UTF-8”</param>
        ///// <returns>返回字符串json格式</returns>
        //public static string CustWebRequest(string url, string recData, string encoding = "UTF-8", string reqTyp = "POST", string contentType = "application/x-www-form-urlencoded")
        //{
        //    encoding = string.IsNullOrEmpty(encoding) ? "UTF-8" : encoding;

        //    //   准备请求...  
        //    byte[] data = System.Text.Encoding.GetEncoding(encoding).GetBytes(recData);
        //    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
        //    req.Method = string.IsNullOrEmpty(reqTyp) ? "POST" : reqTyp;
        //    if (req.Method == "POST")
        //    {
        //        req.ContentType = contentType;
        //        //req.ContentLength = recData.Length;

        //        Stream stream = req.GetRequestStream();
        //        //   发送数据  
        //        stream.Write(data, 0, data.Length);
        //        stream.Close();
        //    }

        //    HttpWebResponse rep = (HttpWebResponse)req.GetResponse();
        //    Stream receiveStream = rep.GetResponseStream();
        //    Encoding encode = System.Text.Encoding.GetEncoding(encoding);
        //    StreamReader readStream = new StreamReader(receiveStream, encode);

        //    Char[] read = new Char[256];
        //    int count = readStream.Read(read, 0, 256);
        //    StringBuilder sb = new StringBuilder("");
        //    while (count > 0)
        //    {
        //        String readstr = new String(read, 0, count);
        //        sb.Append(readstr);
        //        count = readStream.Read(read, 0, 256);
        //    }

        //    rep.Close();
        //    readStream.Close();
        //    var response = sb.ToString();
        //    return response;
        //} 
    }
}
