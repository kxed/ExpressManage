using Infrastructure.CrossCutting.IoC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Infrastructure.CrossCutting.EventBus
{
    public class EventBus
    {
        private EventBus() { }
        private static EventBus _eventBus = null;
        private readonly object sync = new object();
        /// <summary>
        /// 对于事件数据的存储，目前采用内存字典
        /// </summary>
        private static Dictionary<Type, List<object>> eventHandlers = new Dictionary<Type, List<object>>();
        /// <summary>
        // checks if the two event handlers are equal. if the event handler is an action-delegated, just simply
        // compare the two with the object.Equals override (since it was overriden by comparing the two delegates. Otherwise,
        // the type of the event handler will be used because we don't need to register the same type of the event handler
        // more than once for each specific event.
        /// </summary>
        private readonly Func<object, object, bool> eventHandlerEquals = (o1, o2) =>
        {
            var o1Type = o1.GetType();
            var o2Type = o2.GetType();
            if (o1Type.IsGenericType &&
                o1Type.GetGenericTypeDefinition() == typeof(ActionDelegatedEventHandler<>) &&
                o2Type.IsGenericType &&
                o2Type.GetGenericTypeDefinition() == typeof(ActionDelegatedEventHandler<>))
                return o1.Equals(o2);
            return o1Type == o2Type;
        };
        /// <summary>
        /// 初始化空的事件总件
        /// </summary>
        public static EventBus Instance
        {
            get
            {
                return _eventBus ?? (_eventBus = new EventBus());
            }
        }
        /// <summary>
        /// 通过ＸＭＬ文件初始化事件总线，订阅信自在ＸＭＬ里配置
        /// </summary>
        /// <returns></returns>
        public static EventBus InstanceForXml()
        {
            if (_eventBus == null)
            {
                //AppDomain.CurrentDomain.SetupInformation.ApplicationBase
                XElement root = XElement.Load(AppDomain.CurrentDomain.BaseDirectory + @"\Config\EventBus.xml");
                foreach (var evt in root.Elements("Event"))
                {
                    List<object> handlers = new List<object>();
                    Assembly eventType = Assembly.Load(evt.Element("PublishEvent").Attribute("Assembly").Value);
                    Type publishEventType = eventType.GetType(evt.Element("PublishEvent").Value);
                    foreach (var subscritedEvt in evt.Elements("SubscribedEvents"))
                        foreach (var concreteEvt in subscritedEvt.Elements("SubscribedEvent"))
                        {
                            Assembly eventHandler = Assembly.Load(concreteEvt.Attribute("Assembly").Value);
                            Type handle = eventHandler.GetType(concreteEvt.Value);

                            handlers.Add(handle);
                        }

                    eventHandlers[publishEventType] = handlers;
                }

                _eventBus = new EventBus();
            }
            return _eventBus;
        }

        /// <summary>
        /// 订阅非泛型版
        /// </summary>
        /// <param name="type"></param>
        /// <param name="eventHandler"></param>
        void Subscribe(Type type, object eventHandler)
        {
            lock (sync)
            {
                var eventType = type.GetGenericArguments()[0];
                //var eventType = type.GetType().GenericTypeArguments[0];
                if (eventHandlers.ContainsKey(eventType))
                {
                    var handlers = eventHandlers[eventType];
                    if (handlers != null)
                    {
                        if (!handlers.Exists(deh => eventHandlerEquals(deh, eventHandler)))
                            handlers.Add(eventHandler);
                    }
                    else
                    {
                        handlers = new List<object>();
                        handlers.Add(eventHandler);
                    }
                }
                else
                    eventHandlers.Add(eventType, new List<object> { eventHandler });
            }
        }


        #region 事件订阅&取消订阅，可以扩展
        /// <summary>
        /// 订阅事件列表
        /// </summary>
        /// <param name="type"></param>
        /// <param name="subTypeList"></param>
        public void Subscribe<TEvent>(IEventHandler<TEvent> eventHandler)
            where TEvent : class, IEvent
        {
            lock (sync)
            {
                var eventType = typeof(TEvent);
                if (eventHandlers.ContainsKey(eventType))
                {
                    var handlers = eventHandlers[eventType];
                    if (handlers != null)
                    {
                        if (!handlers.Exists(deh => eventHandlerEquals(deh, eventHandler)))
                            handlers.Add(eventHandler);
                    }
                    else
                    {
                        handlers = new List<object>();
                        handlers.Add(eventHandler);
                    }
                }
                else
                    eventHandlers.Add(eventType, new List<object> { eventHandler });
            }
        }
        /// <summary>
        /// 订阅事件实体
        /// </summary>
        /// <param name="type"></param>
        /// <param name="subTypeList"></param>
        public void Subscribe<TEvent>(Action<TEvent> eventHandlerFunc)
            where TEvent : class, IEvent
        {
            Subscribe<TEvent>(new ActionDelegatedEventHandler<TEvent>(eventHandlerFunc));
        }
        public void Subscribe<TEvent>(IEnumerable<IEventHandler<TEvent>> eventHandlers)
            where TEvent : class, IEvent
        {
            foreach (var eventHandler in eventHandlers)
                Subscribe<TEvent>(eventHandler);
        }
        /// <summary>
        /// 取消订阅事件
        /// </summary>
        /// <param name="type"></param>
        /// <param name="subType"></param>
        public void Unsubscribe<TEvent>(IEventHandler<TEvent> eventHandler)
            where TEvent : class, IEvent
        {
            lock (sync)
            {
                var eventType = typeof(TEvent);
                if (eventHandlers.ContainsKey(eventType))
                {
                    var handlers = eventHandlers[eventType];
                    if (handlers != null
                        && handlers.Exists(deh => eventHandlerEquals(deh, eventHandler)))
                    {
                        var handlerToRemove = handlers.First(deh => eventHandlerEquals(deh, eventHandler));
                        handlers.Remove(handlerToRemove);
                    }
                }
            }
        }
        public void Unsubscribe<TEvent>(IEnumerable<IEventHandler<TEvent>> eventHandlers)
          where TEvent : class, IEvent
        {
            foreach (var eventHandler in eventHandlers)
                Unsubscribe<TEvent>(eventHandler);
        }
        public void Unsubscribe<TEvent>(Action<TEvent> eventHandlerFunc)
            where TEvent : class, IEvent
        {
            Unsubscribe<TEvent>(new ActionDelegatedEventHandler<TEvent>(eventHandlerFunc));
        }
        #endregion

        #region 事件发布
        /// <summary>
        /// 发布事件，支持异步事件
        /// </summary>
        /// <typeparam name="TEvent"></typeparam>
        /// <param name="evnt"></param>
        public void Publish<TEvent>(TEvent evnt)
           where TEvent : class, IEvent
        {
            if (evnt == null)
                throw new ArgumentNullException("evnt");
            var eventType = evnt.GetType();
            if (eventHandlers.ContainsKey(eventType)
                && eventHandlers[eventType] != null
                && eventHandlers[eventType].Count > 0)
            {
                var handlers = eventHandlers[eventType];
                foreach (var handler in handlers)
                {
                    //var asb = Assembly.Load("Application.MainModule");
                    //var handler1 = asb.GetType(handler.ToString());
                    var oi = IoCFactory.Instance.CurrentContainer.Resolve(handler.ToString());
                    var eventHandler = oi as IEventHandler<TEvent>;

                    //if (eventHandler.GetType().IsDefined(typeof(HandlesAsynchronouslyAttribute), false))
                    //{
                    //    //Task.Factory.StartNew((o) => eventHandler.Handle((TEvent)o), evnt);
                    //}
                    //else
                    //{
                    var methods = eventHandler.GetType().GetMethods();
                    var eventMethods = methods.Where(a => IsEventHandler(a, evnt));
                    foreach (var methodInfo in eventMethods)
                    {
                        methodInfo.Invoke(eventHandler, new object[] { evnt });
                    }
                    //eventHandler.Handle(evnt);

                    //var asb = Assembly.Load("Application.MainModule");
                    //var handler1 = asb.GetType(handler.ToString());
                    //var oi = IoCFactory.Instance.CurrentContainer.Resolve(handler1);
                    //var eventHandler = oi as IEventHandler<TEvent>;
                    //eventHandler.Handle(evnt);
                }
            }
        }

        public void Publish<TEvent>(TEvent evnt, Action<TEvent, bool, Exception> callback, TimeSpan? timeout = null)
           where TEvent : class, IEvent
        {
            if (evnt == null)
                throw new ArgumentNullException("evnt");
            var eventType = evnt.GetType();
            if (eventHandlers.ContainsKey(eventType) &&
                eventHandlers[eventType] != null &&
                eventHandlers[eventType].Count > 0)
            {
                var handlers = eventHandlers[eventType];
                List<Task> tasks = new List<Task>();
                try
                {
                    foreach (var handler in handlers)
                    {
                        var eventHandler = handler as IEventHandler<TEvent>;
                        if (eventHandler.GetType().IsDefined(typeof(HandlesAsynchronouslyAttribute), false))
                        {
                            //tasks.Add(Task.Factory.StartNew((o) => eventHandler.Handle((TEvent)o), evnt));
                        }
                        else
                        {
                            //eventHandler.Handle(evnt);
                        }
                    }
                    if (tasks.Count > 0)
                    {
                        if (timeout == null)
                            Task.WaitAll(tasks.ToArray());
                        else
                            Task.WaitAll(tasks.ToArray(), timeout.Value);
                    }
                    callback(evnt, true, null);
                }
                catch (Exception ex)
                {
                    callback(evnt, false, ex);
                }
            }
            else
                callback(evnt, false, null);
        }

        #endregion

        private bool IsEventHandler<TEvent>(MethodInfo method, TEvent evnt)
        {
            var parameters = method.GetParameters();

            return parameters.Count() == 1 && parameters[0].ParameterType == evnt.GetType();
        }
    }
}
