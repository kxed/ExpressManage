using Domain.ExpressModule.CustomerManage;
using Domain.ExpressModule.Entities;
using Infrastructure.CrossCutting.Logging;
using Infrastructure.Data.Core;
using Infrastructure.Data.ExpressModule.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.ExpressModule.Repositories
{
    public class CustomerRepository : Repository<CustomerInfo>, ICustomerInfoRepository
    {
        #region Constructor

        /// <summary>
        /// Default constructor
        /// </summary>
        /// <param name="traceManager">Trace manager dependency</param>
        /// <param name="unitOfWork">Specific unitOfWork for this repository</param>
        public CustomerRepository(IExpressModuleUnitOfWork unitOfWork, ITraceManager traceManager) : base(unitOfWork, traceManager) { }

        #endregion
    }
}
