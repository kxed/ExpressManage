using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Microsoft.Practices.Unity;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.Practices.Unity.Configuration;
using Microsoft.Practices.Unity.InterceptionExtension;
using System.Configuration;

namespace FinanceForMobile.IOC
{
    public class IocContainer
    {
        private static IUnityContainer container;
        private static readonly object locker = new object();

        public static IUnityContainer Current
        {
            get
            {
                if (container == null)
                {
                    lock (locker)
                    {
                        if (container == null)
                        {
                            container = new UnityContainer();
                        }
                    }
                }
                return container;
            }
        }

        public static IUnityContainer GetUnityContainer()
        {
            Current.RegisterType<IControllerActivator, CustomControllerActivator>();
            container.AddNewExtension<Interception>();

            //DAL();
            //SysRepository();
            //SysBll();
            //SysService();

            //第一种
            //UnityConfigurationSection section = (UnityConfigurationSection)System.Configuration.ConfigurationManager.GetSection("unity");
            //section.Containers[0].Configure(container);

            //第二种
            //container.LoadConfiguration("containerOne");

            //第三种
            //UnityConfigurationSection section = (UnityConfigurationSection)ConfigurationManager.GetSection("unity");
            //section.Containers["containerOne"].Configure(container);

            //独立配置文件
            var unityConfig = System.AppDomain.CurrentDomain.BaseDirectory + @"Config\unity.config";

            var fileMap = new ExeConfigurationFileMap() { ExeConfigFilename = unityConfig };
            var configuration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
            var unitySection = (UnityConfigurationSection)configuration.GetSection("unity");
            //container.LoadConfiguration(unitySection);
            unitySection.Containers["containerOne"].Configure(container);

            return Current;
        }

        private static void SysRepository()
        {
            
        }

        private static void SysBll()
        {
            
        }

        private static void SysService()
        {
            
        }

        private static void DAL()
        {
            //container.RegisterType<Finance_MobileEntities>(new TransientLifetimeManager());
        }
    }

    public class CustomControllerActivator : IControllerActivator
    {
        /// <summary>
        /// 创建一个自定义控制器
        /// </summary>
        /// <param name="requestContext"></param>
        /// <param name="controllerType"></param>
        /// <returns></returns>
        public IController Create(RequestContext requestContext, Type controllerType)
        {
            return DependencyResolver.Current.GetService(controllerType) as IController;
        }
    }
}
