using System;
using Domain.Interfaces;

namespace Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly StoreContext _context;

    public UnitOfWork(StoreContext context)
    {
        _context = context;
    }

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }
}
