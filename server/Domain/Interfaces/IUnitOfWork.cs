using System;
using Domain.Interfaces.Repositories;

namespace Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IAddressRepository Addresses { get; }
    IBannerRepository Banners { get; }
    IBrandRepository Brands { get; }
    Task<bool> CommitAsync(CancellationToken cancellationToken);
}
