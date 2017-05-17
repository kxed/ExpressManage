using Domain.ExpressModule.Entities;
using Domain.ExpressModule.CustomerManage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ExpressModule.CustomerManagement
{
    public class CustomerManagementServices : ICustomerManagementServices
    {
        #region Members
        ICustomerInfoRepository _customerInfoRepository;
        #endregion
        #region Constructor
        public CustomerManagementServices(ICustomerInfoRepository customerInfoRepository)
        {
            _customerInfoRepository = customerInfoRepository;
        }
        #endregion

        #region ICustomerInfoRepository Members
        public bool IsExist(string tel, string wechatId)
        {
            throw new NotImplementedException();
        }

        public void Create(CustomerInfo customer)
        {
            if (customer == null)
                throw new ArgumentNullException("客户信息有误");
            _customerInfoRepository.Add(customer);
            _customerInfoRepository.UnitOfWork.Commit();
        }

        public void Change(CustomerInfo customer)
        {
            if (customer == null)
                throw new ArgumentNullException("客户信息有误");
            _customerInfoRepository.Modify(customer);
            _customerInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }
        public void Delete(string uniqueId)
        {
            if (uniqueId == null)
                throw new ArgumentNullException("客户信息有误");
            _customerInfoRepository.ModifyByCondition(a => { a.Status = 0; }, a => a.UniqueId == uniqueId);
            _customerInfoRepository.UnitOfWork.CommitAndRefreshChanges();
        }

        public CustomerInfo GetInfo(string uniqueId)
        {
            return _customerInfoRepository.GetFilteredElements(a => a.UniqueId == uniqueId).FirstOrDefault();
        }

        public IEnumerable<CustomerInfo> GetList(string tel, string name, string webchatId,int status = 1)
        {
            CustomerSpecification cSpec = new CustomerSpecification(new CustomerInfo { Csr_Tel = tel, Csr_Name = name, WeChat_Id = webchatId, Status = status });
            return _customerInfoRepository.GetBySpec(cSpec);
        }

        public IEnumerable<CustomerInfo> GetListByPage(string tel, string name, string webchatId, int pageSize, int pageIndex, int status = 1)
        {
            CustomerSpecification cSpec = new CustomerSpecification(new CustomerInfo { Csr_Tel = tel, Csr_Name = name, WeChat_Id = webchatId, Status = status });
            return _customerInfoRepository.GetBySpec(cSpec,pageIndex,pageSize,a=>a.CreateTime);
        }
        #endregion

        #region Disposable Members
        public void Dispose()
        {
            if (_customerInfoRepository != (ICustomerInfoRepository)null)
            {
                this._customerInfoRepository.UnitOfWork.Dispose();
            }
        }
        #endregion
    }
}
