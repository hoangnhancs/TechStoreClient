using System;
using Domain.Interfaces.Repositories;

namespace Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAddressRepository Addresses { get; }
    IBannerRepository Banners { get; }
    Task<bool> CommitAsync(CancellationToken cancellationToken);
}
