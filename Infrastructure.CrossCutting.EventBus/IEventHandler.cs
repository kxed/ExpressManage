﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.CrossCutting.EventBus
{
    public interface IEventHandler<TEvent> where TEvent : IEvent
    {
    }
}
