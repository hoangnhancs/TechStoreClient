using System;
using Domain.Interfaces.Repositories;

namespace Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAddressRepository Addresses { get; }
    IBaseRepository<T> Repository<T>() where T : class;
    Task<bool> CommitAsync(CancellationToken cancellationToken);
}
