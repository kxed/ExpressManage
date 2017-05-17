using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebChat_Api.Authorize
{
    public class BaseController : Controller
    {
        private LoginUser currentloginuser;

        public LoginUser CurrentLoginUser
        {
            get
            {
                if (currentloginuser == null)
                {
                    var userInfo = LoginAuth.Instance.CurrentUser();
                    if(!string.IsNullOrEmpty(userInfo))
                        currentloginuser = JsonConvert.DeserializeObject<LoginUser>(userInfo);
                }
                return currentloginuser;
            }
            set
            {
                currentloginuser = value;
            }
        }


        protected override void OnException(ExceptionContext filterContext)
        {
            SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", filterContext.Exception.Message,filterContext.Exception.StackTrace,filterContext.Exception.Source));
            
            base.OnException(filterContext);
        }

        protected KeyValuePair<string, string[]>[] GetModelState()
        {
            System.Text.StringBuilder sbErrors = new System.Text.StringBuilder();
            List<KeyValuePair<string, string[]>> dics = new List<KeyValuePair<string, string[]>> { };
            foreach (var item in this.ModelState.Keys)
            {
                if (this.ModelState[item].Errors.Count > 0)
                {
                    dics.Add(new KeyValuePair<string, string[]>(item, this.ModelState[item].Errors.Select(p => p.ErrorMessage).ToArray()));
                }
            }
            return dics.ToArray();
        }

        protected JsonResult ModelStateToJsonResult(Action action)
        {
            AjaxResult result = new AjaxResult();
            result.status = true;
            try
            {
                action.Invoke();
            }
            catch (Exception ex)
            {
                SysLog.Write("错误监控:", ex.Message + " " + ex.StackTrace);
                result.status = false;
                result.errormessage = ex.Message;
            }
            return Json(result);
        }
        protected AjaxResult ModelStateToResult(Action action)
        {
            AjaxResult result = new AjaxResult();
            result.status = true;
            try
            {
                action.Invoke();
            }
            catch (Exception ex)
            {
                SysLog.Write("错误监控:", ex.Message + " " + ex.StackTrace);
                result.status = false;
                result.errormessage = ex.Message;
            }
            return result;
        }

        protected JsonResult ModelStateToJsonResult<T>(Action<AjaxResult<T>> action)
        {
            AjaxResult<T> result = new AjaxResult<T>();
            result.status = true;
            try
            {
                action.Invoke(result);
            }
            catch (Exception ex)
            {
                result.status = false;
                result.errormessage = ex.Message;
            }

            return Json(result);
        }




        /// <summary>
        /// 将View输出为字符串
        /// </summary>
        /// <param name="controller">Controller实例</param>
        /// <param name="viewName">如果view文件在当前Controller目录下，则直接输入文件名(例:Toolbar)；否则,从根路径开始指定(例：~/Views/User/Toolbar.cshtml)</param>
        /// <param name="masterName">母板页文件名</param>
        /// <returns>字符串</returns>
        protected string RenderViewToString(string viewName, string masterName)
        {


            IView view = ViewEngines.Engines.FindView(this.ControllerContext, viewName, masterName).View;
            using (StringWriter writer = new StringWriter())
            {
                ViewContext viewContext = new ViewContext(ControllerContext, view, this.ViewData, this.TempData, writer);
                viewContext.View.Render(viewContext, writer);
                return writer.ToString();
            }
        }




        /// <summary>
        /// 将PartialView输出为字符串
        /// </summary>
        /// <param name="controller">Controller实例</param>
        /// <param name="viewName">如果PartialView文件在当前Controller目录下，则直接输入文件名(例:Toolbar)；否则,从根路径开始指定(例：~/Views/User/Toolbar.cshtml)</param>
        /// <param name="model">构造页面所需的的实体参数</param>
        /// <returns>字符串</returns>
        public string RenderPartialViewToString(string viewName, object model)
        {

            IView view = ViewEngines.Engines.FindPartialView(ControllerContext, viewName).View;
            this.ViewData.Model = model;
            using (StringWriter writer = new StringWriter())
            {
                ViewContext viewContext = new ViewContext(this.ControllerContext, view, this.ViewData, this.TempData, writer);
                viewContext.View.Render(viewContext, writer);
                return writer.ToString();
            }
        }

        //protected void ExportExcel(string reportName, HSSFWorkbook workbook)
        //{
        //    string contenttype = "application/vnd.ms-excel";
        //    byte[] btyes = btyes = GetHSSFWorkbookBytes(workbook);
        //    ExportFile(reportName, contenttype, btyes);
        //}

        //protected byte[] GetHSSFWorkbookBytes(HSSFWorkbook workbook)
        //{
        //    byte[] btyes = null;
        //    using (MemoryStream excelStream = new MemoryStream())
        //    {
        //        workbook.Write(excelStream);
        //        excelStream.Flush();
        //        excelStream.Position = 0;
        //        btyes = excelStream.ToArray();
        //        excelStream.Close();
        //    }
        //    return btyes;
        //}

        protected void ExportFile(string reportName, string contenttype, byte[] btyes)
        {
            Response.ContentType = contenttype;
            Response.AppendHeader("Content-disposition", "attachment;filename=" + reportName);
            Response.BinaryWrite(btyes);
            Response.End();
        }
    }

    public class AjaxResult<T> : AjaxResult
    {
        public T result { get; set; }
    }
    public class AjaxResult
    {
        public bool status { get; set; }
        public string errormessage { get; set; }
        public string redirect { get; set; }
        public string uniqueId { get; set; }
    }
}
