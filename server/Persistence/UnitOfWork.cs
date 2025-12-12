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
    private readonly ConcurrentDictionary<Type, object> _repositories = new();

    public UnitOfWork(StoreContext context)
    {
        _context = context;
    }
    public IAddressRepository Addresses => _addresses ??= new AddressRepository(_context);

    public async Task<bool> CommitAsync(CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public IBaseRepository<T> Repository<T>() where T : class
    {
        if (_repositories.ContainsKey(typeof(T)))
            return (IBaseRepository<T>)_repositories[typeof(T)];

        var repo = new BaseRepository<T>(_context);
        _repositories[typeof(T)] = repo;
        return repo;
    }
}
