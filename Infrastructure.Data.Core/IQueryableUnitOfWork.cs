﻿//===================================================================================
// Microsoft Developer & Platform Evangelism
//=================================================================================== 
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
//===================================================================================
// Copyright (c) Microsoft Corporation.  All Rights Reserved.
// This code is released under the terms of the MS-LPL license, 
// http://microsoftnlayerapp.codeplex.com/license
//===================================================================================
using System.Data.Objects;

using Domain.Core;
using Domain.Core.Entities;


namespace Infrastructure.Data.Core
{
    /// <summary>
    /// This is the minimun contract for all unit of work, one unit of work per module, that extend
    /// base IUnitOfWork contract with specific features of ADO .NET EF and STE. 
    /// Creation of this and base contract add isolation feature from specific contract for
    /// testing purposed and delete innecesary dependencies
    /// </summary>
    public interface IQueryableUnitOfWork : IUnitOfWork
    {
        /// <summary>
        /// Create a object set for a type TEntity
        /// </summary>
        /// <typeparam name="TEntity">Type of elements in object set</typeparam>
        /// <returns>Object set of type {TEntity}</returns>
        IObjectSet<TEntity> CreateSet<TEntity>() where TEntity : class,IObjectWithChangeTracker;

    }
}
