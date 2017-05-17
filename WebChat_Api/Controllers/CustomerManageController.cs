using Application.ExpressModule.CustomerManagement;
using Domain.Core.Entities;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.IoC;
using Infrastructure.CrossCutting.NetFramework.Utils;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebChat_Api.Authorize;

namespace WebChat_Api.Controllers
{
    public class CustomerManageController : BaseController
    {
        //
        // GET: /CustomerManage/
        ICustomerManagementServices customerServices = IoCFactory.Instance.CurrentContainer.Resolve<ICustomerManagementServices>();

        public ActionResult CustomerOperation(string type,string uniqueId)
        {
            CustomerInfo customer = new CustomerInfo();
            customer.OperationType = "none";
            if(!string.IsNullOrEmpty(uniqueId))
            {
                if (uniqueId.ToLower() != "edit" && uniqueId.ToLower() != "create")
                    customer = customerServices.GetInfo(uniqueId);
                customer.OperationType = uniqueId.ToLower();
            }
            customer.CustomerType = type;
            
            return View(customer);
        }

        public ActionResult Index(string type)
        {
            ViewBag.CustomerType = type;
            return View();
        }
        public ActionResult QueryAddress(string condition, int pageNo, int rowCount)
        {
            var temp = new {
                totalCount = customerServices.GetList(condition, condition, CurrentLoginUser.ClientID).Count(),
                pageSize = rowCount,
                pageIndex = pageNo,
                result = customerServices.GetListByPage(condition, condition, CurrentLoginUser.ClientID, rowCount, pageNo),
                status = true
            };
            return Json(temp,JsonRequestBehavior.AllowGet);
        }

        public ActionResult SubmitCustomer(string name,string tel,string addr,string addr_detail,string uniqueId)
        {
            try
            {
                string returnUniqueId = Guid.NewGuid().ToString();
                if (string.IsNullOrEmpty(uniqueId))
                {
                    //新增
                    customerServices.Create(new CustomerInfo
                    {
                        CreateTime = DateTime.Now,
                        Csr_Addr = addr,
                        Csr_AddrDetail = addr_detail,
                        Csr_Name = name,
                        Csr_Tel = tel,
                        Status = 1,
                        UniqueId = returnUniqueId,
                        WeChat_Id = CurrentLoginUser.ClientID,

                    });
                }
                else
                {
                    returnUniqueId = uniqueId;
                    //修改
                    var customer = customerServices.GetInfo(uniqueId);
                    customer.Csr_Addr = addr;
                    customer.Csr_AddrDetail = addr_detail;
                    customer.Csr_Name = name;
                    customer.Csr_Tel = tel;
                    customer.Status = 1;
                    customer.WeChat_Id = CurrentLoginUser.ClientID;
                    customerServices.Change(customer);
                }
                return ModelStateToJsonResult<AjaxResult>((result) => 
                {
                    result.uniqueId = returnUniqueId;
                    result.status = true;
                });
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
            
                return ModelStateToJsonResult<AjaxResult>((result) =>
                {
                    result.status = false;
                    result.errormessage = "服务器繁忙，请稍后再试！";
                });
            }
        }

        public ActionResult DeleteAddress(string uniqueId)
        {
            try
            {
                customerServices.Delete(uniqueId);
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = true;
                });
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = false;
                    re.errormessage = "服务器繁忙，请稍后再试！";
                });
            }
        }
        public ActionResult GetAddressRedirectBack(CustomerDTO customer,string type)
        {
            try
            {
                var loginUser = this.CurrentLoginUser;
                if (type.ToLower() == "sending")
                {
                    loginUser.Sending = customer;
                }
                else
                    loginUser.Receiving = customer;

                LoginAuth.Instance.SetCookie(JsonConvert.SerializeObject(loginUser));

                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = true;
                });
            }
            catch (Exception ex)
            {
                SysLog.Write("系统异常", string.Format("异常信息，Message:{0},StackTrace:{1},Source:{2}", ex.Message, ex.StackTrace, ex.Source));
                return ModelStateToJsonResult<AjaxResult>((re) =>
                {
                    re.status = false;
                    re.errormessage = "服务器繁忙，请稍后再试！";
                });
            }
            
        }
    }
}
