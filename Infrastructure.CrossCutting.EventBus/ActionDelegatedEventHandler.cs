using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.EventBus
{
    internal sealed class ActionDelegatedEventHandler<TEvent> : IEventHandler<TEvent>
    where TEvent : class, IEvent
    {
        #region Private Fields
        private readonly Action<TEvent> eventHandlerDelegate;
        #endregion

        #region Ctor
        /// <summary>
        /// 初始化一个新的<c>ActionDelegatedDomainEventHandler{TEvent}</c>实例。
        /// </summary>
        /// <param name="eventHandlerDelegate">用于当前领域事件处理器所代理的事件处理委托。</param>
        public ActionDelegatedEventHandler(Action<TEvent> eventHandlerDelegate)
        {
            this.eventHandlerDelegate = eventHandlerDelegate;
        }
        #endregion

        /// <summary>
        /// 处理给定的事件。
        /// </summary>
        /// <param name="evnt">需要处理的事件。</param>
        public void Handle(TEvent evnt)
        {
            this.eventHandlerDelegate(evnt);
        }
    }
}
