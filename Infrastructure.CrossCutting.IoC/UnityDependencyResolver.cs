using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Microsoft.Practices.Unity;

namespace FinanceForMobile.IOC
{
    public class UnityDependencyResolver : IDependencyResolver
    {
        private IUnityContainer _container;
        public UnityDependencyResolver(IUnityContainer container)
        {
            this._container = container;
        }

        /// <summary>
        /// 获取服务
        /// </summary>
        /// <param name="serviceType"></param>
        /// <returns></returns>
        public object GetService(Type serviceType)
        {
            return (serviceType.IsClass && !serviceType.IsAbstract) ||
            _container.IsRegistered(serviceType) ?
            _container.Resolve(serviceType) : null;
        }

        /// <summary>
        /// 获取服务集 
        /// </summary>
        /// <param name="serviceType"></param>
        /// <returns></returns>
        public IEnumerable<object> GetServices(Type serviceType)
        {
            return (serviceType.IsClass && !serviceType.IsAbstract) ||
            _container.IsRegistered(serviceType) ?
            _container.ResolveAll(serviceType) : new object[] { };
        }
    }
}
