using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Application.ExpressModule.UserManagement;
using Infrastructure.CrossCutting.IoC;
using Domain.ExpressModule.Entities;
using Application.ExpressModule.CustomerManagement;
using Application.ExpressModule.OrderManagement;

namespace Application.ExpressModule.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            IUserManagementServices _userService = IoCFactory.Instance.CurrentContainer.Resolve<IUserManagementServices>();
            var users = _userService.GetUsers();

            Guid id = Guid.NewGuid();
            _userService.CreateUser(new UserInfo()
            {
                UserName = "张宇",
                UserNickName = "austin",
                Tel = "13311596779",
                PID = "13062119890507542X",
                UniqueId = id.ToString(),
                UserPwd = "11223344"
            });
            //Guid id = new Guid("0604c7ab-01fe-4c52-bbc2-b1a62583e52d");
            users = _userService.GetUsers();
            _userService.ChangeUser(new UserInfo()
            {
                UserName = "章鱼1",
                UserNickName = "austin",
                Tel = "13910226712",
                PID = "13062119890507542X",
                UniqueId = id.ToString(),
                UserPwd = "121121"
            });
            var u = _userService.GetInfo(id.ToString());
            u.UserName = "章鱼12";
            u.UserNickName = "austin";
            u.Tel = "13910226712";
            u.PID = "13062119890507542X";
            u.UniqueId = id.ToString();
            u.UserPwd = "121121";
            _userService.ChangeUser(u);
            users = _userService.GetUsers();
            _userService.ChangePassword(id.ToString(), "121121", "QAZWSX");
            users = _userService.GetUsers();
            _userService.ResetPassWord(id.ToString());

            users = _userService.GetUsers();
        }
        [TestMethod]
        public void TestCustomer()
        {
            ICustomerManagementServices _customerServices = IoCFactory.Instance.CurrentContainer.Resolve<ICustomerManagementServices>();

            Guid id = Guid.NewGuid();

            _customerServices.Create(new CustomerInfo
            {
                Csr_Name = "李玲蔚",
                Csr_Tel = "13311596779",
                Csr_Addr = "河南省/漯河市/源汇区",
                Csr_PostCode = "462300",
                Csr_AddrDetail = "大学路48号",
                CreateTime = DateTime.Now,
                UniqueId = id.ToString(),
                WeChat_Id = "okP1KwtHFXKRHTt-2wpa329WAcic"
            });
            var customerInfo = _customerServices.GetInfo(id.ToString());
            customerInfo.Csr_Name = "董大伟";
            customerInfo.Csr_Tel = "13910226712";
            _customerServices.Change(customerInfo);
            var customers = _customerServices.GetList("","","");
            Assert.IsNotNull(customers);
        }
        [TestMethod]
        public void TestOrder() 
        {
            IOrderManagementServices _orderServices = IoCFactory.Instance.CurrentContainer.Resolve<IOrderManagementServices>();
            Guid id = Guid.NewGuid();
            _orderServices.Create(new OrderInfo { 
                CreateTime = DateTime.Now,
                Csr_Addr_J = "河南省/漯河市/源汇区",
                Csr_Addr_S = "河南省/漯河市/源汇区",
                Csr_AddrDetail_J = "大学路40号",
                Csr_AddrDetail_S = "大学路40号",
                Csr_Name_J = "王大路",
                Csr_Name_S="李达康",
                Csr_PostCode_J = "462300",
                Csr_PostCode_S = "462300",
                Csr_Tel_J = "13311596779",
                Csr_Tel_S = "15910227839",
                Csr_UniqueId_J = "0c1206a2-d0ff-4915-9709-ecfad0ec9afc",
                Csr_UniqueId_S = "9244e4c8-0a61-4d81-ac4e-09cd90c7d84c",
                ExpectPrice = 40,
                ExpectTime = DateTime.Parse("2017-5-11 09:00:00"),
                ExpectWeight = 2,
                Goods = "电脑",
                UniqueId = id.ToString(),
                Mark = "要上楼",
                Payway=""
            });

            var orderInfo = _orderServices.GetInfo(id.ToString());
            _orderServices.Change(orderInfo);

            _orderServices.ChangeOrderStatus(id.ToString(), 2);

            var orders = _orderServices.GetList("","","");
            Assert.IsNotNull(orders);
        }
        [TestMethod]
        public void Test()
        {
            
        }
    }
}
