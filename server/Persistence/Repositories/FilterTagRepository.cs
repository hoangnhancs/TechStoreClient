using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class FilterTagRepository(StoreContext context) : IFilterTagRepository
{
    private readonly StoreContext _context = context;
    public async Task<List<FilterTag>> GetListFilterTagByCategoryId(int categoryId, CancellationToken cancellationToken)
    {
        return await _context.FilterTags
            .Where(ft => ft.CategoryId == categoryId)
            .Include(ft => ft.Values)
            .ToListAsync(cancellationToken);
    }
}
