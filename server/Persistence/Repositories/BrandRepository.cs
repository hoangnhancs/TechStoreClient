using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class BrandRepository(StoreContext context) : BaseRepository<Brand>(context), IBrandRepository
{
    // private readonly StoreContext _context = context;
    public async Task<List<Brand>> GetBrandsByCategory(int categoryId, CancellationToken cancellationToken)
    {
        return await _context.Brands.Where(b => b.CategoryId == categoryId).ToListAsync(cancellationToken);
    }
}
