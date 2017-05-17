using Domain.ExpressModule.Entities;
using Domain.ExpressModule.OrderManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.OrderManagement
{
    public class OrderManagementServices:IOrderManagementServices
    {
        #region Members
        IOrderInfoRepository _orderInfoRepository;
        #endregion
        #region Constructor
        public OrderManagementServices(IOrderInfoRepository orderInfoRepository)
        {
            _orderInfoRepository = orderInfoRepository;
        }
        #endregion

        #region IOrderManagementServices Members
        public void Create(OrderInfo orderInfo)
        {
            if (orderInfo == null)
                throw new ArgumentNullException("订单信息有误");
            _orderInfoRepository.Add(orderInfo);
            _orderInfoRepository.UnitOfWork.Commit();
        }

        public void Change(OrderInfo orderInfo)
        {
            if (orderInfo == null)
                throw new ArgumentNullException("订单信息有误");
            _orderInfoRepository.Modify(orderInfo);
            _orderInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }

        public void ChangeOrderStatus(string uniqueId, int status, string remark="")
        {
            if (string.IsNullOrEmpty(uniqueId))
                throw new ArgumentNullException("订单标识有误");
            if (!string.IsNullOrEmpty(remark))
                _orderInfoRepository.ModifyByCondition(a => { a.Status = status; a.StatusMark = remark; }, a => a.UniqueId == uniqueId);
            else
                _orderInfoRepository.ModifyByCondition(a => a.Status = status, a => a.UniqueId == uniqueId);
            
            _orderInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }
        public void CancelOrder(string uniqueId, string remark)
        {
            if (string.IsNullOrEmpty(uniqueId))
                throw new ArgumentNullException("订单标识有误");
            if (!string.IsNullOrEmpty(remark))
                _orderInfoRepository.ModifyByCondition(a => { a.Status = (int)OrderStatus.Cancel; a.StatusMark = remark; a.CancelTime = DateTime.Now; }, a => a.UniqueId == uniqueId);
            else
                _orderInfoRepository.ModifyByCondition(a => {a.Status = (int)OrderStatus.Cancel; a.CancelTime = DateTime.Now;}, a => a.UniqueId == uniqueId);

            _orderInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }
        public void ConfirmOrder(string uniqueId, string remark)
        {
            if (string.IsNullOrEmpty(uniqueId))
                throw new ArgumentNullException("订单标识有误");
            if (!string.IsNullOrEmpty(remark))
                _orderInfoRepository.ModifyByCondition(a => { a.Status = (int)OrderStatus.StayPay; a.StatusMark = remark; a.ReceiptTime = DateTime.Now; }, a => a.UniqueId == uniqueId);
            else
                _orderInfoRepository.ModifyByCondition(a => { a.Status = (int)OrderStatus.StayPay; a.ReceiptTime = DateTime.Now; }, a => a.UniqueId == uniqueId);

            _orderInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }
        public void PayOrder(string uniqueId, string remark)
        {
            if (string.IsNullOrEmpty(uniqueId))
                throw new ArgumentNullException("订单标识有误");
            if (!string.IsNullOrEmpty(remark))
                _orderInfoRepository.ModifyByCondition(a => { a.Status = (int)OrderStatus.Payed; a.StatusMark = remark; a.PayTime = DateTime.Now; }, a => a.UniqueId == uniqueId);
            else
                _orderInfoRepository.ModifyByCondition(a => { a.Status = (int)OrderStatus.Payed; a.PayTime = DateTime.Now; }, a => a.UniqueId == uniqueId);

            _orderInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }
        public OrderInfo GetInfo(string uniqueId)
        {
            if (string.IsNullOrEmpty(uniqueId))
                throw new ArgumentNullException("订单标识有误");
            return _orderInfoRepository.GetFilteredElements(a => a.UniqueId == uniqueId).FirstOrDefault();
        }

        public IEnumerable<OrderInfo> GetList(string tel, string name, string wechatId)
        {
            OrderSecification oSpec = new OrderSecification(new OrderInfo { Csr_Tel_J = tel, Csr_Tel_S = tel, Csr_Name_J = tel, Csr_Name_S = name, WechatId = wechatId });
            return _orderInfoRepository.GetBySpec(oSpec);
        }

        public IEnumerable<OrderInfo> GetListByPage(string tel, string name, string wechatId, int pageSize, int pageIndex)
        {
            OrderSecification oSpec = new OrderSecification(new OrderInfo { Csr_Tel_J = tel, Csr_Tel_S = tel, Csr_Name_J = tel, Csr_Name_S = name, WechatId = wechatId });
            return _orderInfoRepository.GetBySpec(oSpec,pageIndex, pageSize, a => a.UniqueId, true);
        }
        #endregion

        #region Disposable Members
        public void Dispose()
        {
            if (_orderInfoRepository != (IOrderInfoRepository)null)
            {
                this._orderInfoRepository
                    .UnitOfWork
                    .Dispose();
            }
        }
        #endregion
    }
}
