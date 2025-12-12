using System;
using System.Collections.Concurrent;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Persistence.Repositories;

namespace Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly StoreContext _context;
    private IAddressRepository? _addresses;
    private IBannerRepository? _banners;
    private IBrandRepository? _brands;
    private ICategoryRepository? _categories;
    private readonly ConcurrentDictionary<Type, object> _repositories = new();

    public UnitOfWork(StoreContext context)
    {
        _context = context;
    }
    public IAddressRepository Addresses => _addresses ??= new AddressRepository(_context);
    public IBannerRepository Banners => _banners ??= new BannerRepository(_context);
    public IBrandRepository Brands => _brands ??= new BrandRepository(_context);
    public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);
    public async Task<bool> CommitAsync(CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
