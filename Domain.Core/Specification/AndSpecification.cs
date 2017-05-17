//===================================================================================
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
using System;
using System.Linq.Expressions;
using Domain.Core;

namespace Domain.Core.Specification
{
    /// <summary>
    /// A logic AND Specification
    /// </summary>
    /// <typeparam name="TEntity">Type of entity that check this specification</typeparam>
    public sealed class AndSpecification<TEntity>
       : CompositeSpecification<TEntity>
       where TEntity : class
    {
        #region Members

        private ISpecification<TEntity> _RightSideSpecification = null;
        private ISpecification<TEntity> _LeftSideSpecification = null;

        #endregion

        #region Public Constructor

        /// <summary>
        /// Default constructor for AndSpecification
        /// </summary>
        /// <param name="leftSide">Left side specification</param>
        /// <param name="rightSide">Right side specification</param>
        public AndSpecification(ISpecification<TEntity> leftSide, ISpecification<TEntity> rightSide)
        {
            if (leftSide == (ISpecification<TEntity>)null)
                throw new ArgumentNullException("leftSide");

            if (rightSide == (ISpecification<TEntity>)null)
                throw new ArgumentNullException("rightSide");

            this._LeftSideSpecification = leftSide;
            this._RightSideSpecification = rightSide;
        }

        #endregion

        #region Composite Specification overrides

        /// <summary>
        /// Left side specification
        /// </summary>
        public override ISpecification<TEntity> LeftSideSpecification
        {
            get { return _LeftSideSpecification; }
        }

        /// <summary>
        /// Right side specification
        /// </summary>
        public override ISpecification<TEntity> RightSideSpecification
        {
            get { return _RightSideSpecification; }
        }

        /// <summary>
        /// <see cref="Domain.Core.Specification.ISpecification{TEntity}"/>
        /// </summary>
        /// <returns><see cref="Domain.Core.Specification.ISpecification{TEntity}"/></returns>
        public override Expression<Func<TEntity, bool>> SatisfiedBy()
        {
            Expression<Func<TEntity, bool>> left = _LeftSideSpecification.SatisfiedBy();
            Expression<Func<TEntity, bool>> right = _RightSideSpecification.SatisfiedBy();

            return (left.And(right));
           
        }

        #endregion
    }
}
