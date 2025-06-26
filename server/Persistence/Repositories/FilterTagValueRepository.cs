using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class FilterTagValueRepository(StoreContext context) : IFilterTagValueRepository
{
    private readonly StoreContext _context = context;
    public async Task<List<FilterTagValue>> GetListFilterTagValueByCategoryId(int categoryId, CancellationToken cancellationToken)
    {
        return await _context.FilterTagValues
            .Include(ftv => ftv.FilterTag)
            .Where(ftv => ftv.FilterTag != null && ftv.FilterTag.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
        // return await _context.FilterTags
        //     .Where(ft => ft.CategoryId == categoryId)
        //     .SelectMany(ft => ft.Values)
        //     .ToListAsync(cancellationToken);
    }
}
