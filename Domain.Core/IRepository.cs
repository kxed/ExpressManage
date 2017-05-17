using Domain.Core.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Core
{
    public interface IRepository<TEntity> 
        where TEntity : class
    {
        /// <summary>
        /// Get the unit of work in this repository
        /// </summary>
        IUnitOfWork UnitOfWork { get; }

        /// <summary>
        /// Add item into repository
        /// </summary>
        /// <param name="item">Item to add to repository</param>
        void Add(TEntity item);

        /// <summary>
        /// Delete item 
        /// </summary>
        /// <param name="item">Item to delete</param>
        void Remove(TEntity item);

        /// <summary>
        ///Register entity into this repository, really in UnitOfWork. 
        ///In EF this can be done with Attach and with Update in NH
        /// </summary>
        /// <param name="item">Item to attach</param>
        void RegisterItem(TEntity item);

        /// <summary>
        /// Sets modified entity into the repository. 
        /// When calling Commit() method in UnitOfWork 
        /// these changes will be saved into the storage
        /// <remarks>
        /// Internally this method always calls Repository.Attach() and Context.SetChanges() 
        /// </remarks>
        /// </summary>
        /// <param name="item">Item with changes</param>
        void Modify(TEntity item);
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="updateExpression"></param>
        /// <param name="predicate"></param>
        /// <returns></returns>
        void ModifyByCondition(Action<TEntity> updateExpression, Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Get all elements of type {TEntity} in repository
        /// </summary>
        /// <returns>List of selected elements</returns>
        IEnumerable<TEntity> GetAll();

        /// <summary>
        /// Get all elements of type {TEntity} that matching a
        /// Specification <paramref name="specification"/>
        /// </summary>
        /// <param name="specification">Specification that result meet</param>
        /// <returns></returns>
        IEnumerable<TEntity> GetBySpec(ISpecification<TEntity> specification);
        /// <summary>
        /// Get all elements of type {TEntity} that matching a
        /// Specification <paramref name="specification"/>
        /// </summary>
        /// <param name="specification">Specification that result meet</param>
        /// <returns></returns>
        IEnumerable<TEntity> GetBySpec<S>(ISpecification<TEntity> specification, int pageIndex, int pageCount, Expression<Func<TEntity, S>> orderByExpression, bool ascending=true);

        /// <summary>
        /// Get all elements of type {TEntity} in repository
        /// </summary>
        /// <param name="pageIndex">Page index</param>
        /// <param name="pageCount">Number of elements in each page</param>
        /// <param name="orderByExpression">Order by expression for this query</param>
        /// <param name="ascending">Specify if order is ascending</param>
        /// <returns>List of selected elements</returns>
        IEnumerable<TEntity> GetPagedElements<S>(int pageIndex, int pageCount, Expression<Func<TEntity, S>> orderByExpression, bool ascending);

        /// <summary>
        /// Get  elements of type {TEntity} in repository
        /// </summary>
        /// <param name="filter">Filter that each element do match</param>
        /// <returns>List of selected elements</returns>
        IEnumerable<TEntity> GetFilteredElements(Expression<Func<TEntity, bool>> filter);


        /// <summary>
        /// Get all elements of type {TEntity} in repository
        /// </summary>
        /// <param name="filter">Filter that each element do match</param>
        /// <param name="pageIndex">Index of page</param>
        /// <param name="pageCount">Number of elements in each page</param>
        /// <param name="orderByExpression">Order by expression</param>
        /// <param name="ascending">Specify if order is ascending</param>
        /// <returns>List of selected elements</returns>
        IEnumerable<TEntity> GetFilteredElements<S>(Expression<Func<TEntity, bool>> filter, int pageIndex, int pageCount, Expression<Func<TEntity, S>> orderByExpression, bool ascending);

        /// <summary>
        /// Get all elements of type {TEntity} in repository
        /// </summary>
        /// <param name="pageIndex">Page index</param>
        /// <param name="pageCount">Number of elements in each page</param>
        /// <param name="orderByExpression">Order by expression for this query</param>
        /// <param name="ascending">Specify if order is ascending</param>
        /// <param name="specification">Specification that result meet</param>
        /// <returns>List of selected elements</returns>
        IEnumerable<TEntity> GetPagedElements<S>(int pageIndex, int pageCount, Expression<Func<TEntity, S>> orderByExpression, ISpecification<TEntity> specification, bool ascending);

    }
}
