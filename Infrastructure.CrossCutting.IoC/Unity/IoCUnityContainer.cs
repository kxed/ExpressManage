using Infrastructure.CrossCutting.IoC.Resources;
using Infrastructure.CrossCutting.Logging;
using Infrastructure.CrossCutting.NetFramework.Logging;
using Infrastructure.Data.ExpressModule.UnitOfWork;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Microsoft.Practices.Unity.InterceptionExtension;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Routing;

namespace Infrastructure.CrossCutting.IoC.Unity
{
    public class IoCUnityContainer:IContainer
    {
        IDictionary<string, IUnityContainer> _ContainersDictionary;
        public IoCUnityContainer()
        {
            _ContainersDictionary = new Dictionary<string, IUnityContainer>();

            //Create root container
            IUnityContainer rootContainer = new UnityContainer();
            rootContainer.AddNewExtension<Interception>();

            _ContainersDictionary.Add("RootContext", rootContainer);

            //Create container for real context, child of root container
            IUnityContainer realAppContainer = rootContainer.CreateChildContainer();
            _ContainersDictionary.Add("RealAppContext", realAppContainer);

            ConfigureRootContainer(rootContainer);
            ConfigureRealContainer(realAppContainer);
        }
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
            container.AddNewExtension<Interception>();

            ConfigureRootContainer(container);
            ConfigureRealContainer(container);

            return Current;
        }

        #region Private Methods

        static void ConfigureRootContainer(IUnityContainer container)
        {
            //独立配置文件
            var unityConfig = System.AppDomain.CurrentDomain.BaseDirectory + @"\Config\unity.config";

            var fileMap = new ExeConfigurationFileMap() { ExeConfigFilename = unityConfig };
            var configuration = ConfigurationManager.OpenMappedExeConfiguration(fileMap, ConfigurationUserLevel.None);
            var unitySection = (UnityConfigurationSection)configuration.GetSection("unity");
            container.LoadConfiguration(unitySection, "containerOne");
            //unitySection.Containers["containerOne"].Configure(container);
        }

        static void ConfigureRealContainer(IUnityContainer container)
        {
            //container.RegisterType<IMainModuleUnitOfWork, SMSEntities>(new PerResolveLifetimeManager(), new InjectionConstructor());
            container.RegisterType<IExpressModuleUnitOfWork, ExpressManageEntities>(new PerResolveLifetimeManager(), new InjectionConstructor());
        }

        #endregion

        /// <summary>
        /// <see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve{TService}"/>
        /// </summary>
        /// <typeparam name="TService"><see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve{TService}"/></typeparam>
        /// <returns><see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve{TService}"/></returns>
        public TService Resolve<TService>()
        {
            //We use the default container specified in AppSettings
            string containerName = ConfigurationManager.AppSettings["defaultIoCContainer"];

            if (String.IsNullOrEmpty(containerName)
                ||
                String.IsNullOrWhiteSpace(containerName))
            {
                throw new ArgumentNullException(Messages.exception_DefaultIOCSettings);
            }

            if (!_ContainersDictionary.ContainsKey(containerName))
                throw new InvalidOperationException(Messages.exception_ContainerNotFound);

            IUnityContainer container = _ContainersDictionary[containerName];

            return container.Resolve<TService>();
        }

        /// <summary>
        /// <see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve"/>
        /// </summary>
        /// <param name="type"><see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve"/></param>
        /// <returns><see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.Resolve"/></returns>
        public object Resolve(Type type)
        {
            //We use the default container specified in AppSettings
            string containerName = ConfigurationManager.AppSettings["defaultIoCContainer"];

            if (String.IsNullOrEmpty(containerName)
                ||
                String.IsNullOrWhiteSpace(containerName))
            {
                throw new ArgumentNullException(Messages.exception_DefaultIOCSettings);
            }

            if (!_ContainersDictionary.ContainsKey(containerName))
                throw new InvalidOperationException(Messages.exception_ContainerNotFound);

            IUnityContainer container = _ContainersDictionary[containerName];
            
            return container.Resolve(type, null);
        }

        /// <summary>
        /// <see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.RegisterType"/>
        /// </summary>
        /// <param name="type"><see cref="M:Microsoft.Samples.NLayerApp.Infrastructure.CrossCutting.IoC.IContainer.RegisterType"/></param>
        public void RegisterType(Type type)
        {
            IUnityContainer container = this._ContainersDictionary["RootContext"];

            if (container != null)
                container.RegisterType(type, new TransientLifetimeManager());
        }
        public object Resolve(string type)
        {
            //We use the default container specified in AppSettings
            string containerName = ConfigurationManager.AppSettings["defaultIoCContainer"];

            if (String.IsNullOrEmpty(containerName)
                ||
                String.IsNullOrWhiteSpace(containerName))
            {
                throw new ArgumentNullException(Messages.exception_DefaultIOCSettings);
            }

            if (!_ContainersDictionary.ContainsKey(containerName))
                throw new InvalidOperationException(Messages.exception_ContainerNotFound);

            IUnityContainer container = _ContainersDictionary[containerName];
            var regs = container.Registrations.Where(a => a.RegisteredType.FullName.Equals(type));
            if (regs != null && regs.Any())
            {
                var t = regs.FirstOrDefault();
                if(t!=null)
                    return container.Resolve(t.RegisteredType);
                else
                    throw new InvalidOperationException(Messages.exception_ContainerNotFound);
            }else
                throw new InvalidOperationException(Messages.exception_ContainerNotFound);
        }
    }
}
