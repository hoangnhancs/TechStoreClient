using System;
using Domain.Interfaces.Repositories;

namespace Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAddressRepository Addresses { get; }
    Task<bool> CommitAsync(CancellationToken cancellationToken);
}
