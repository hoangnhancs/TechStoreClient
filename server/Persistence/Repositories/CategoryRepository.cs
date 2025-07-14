using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly StoreContext _context;
    public CategoryRepository(StoreContext context)
    {
        _context = context;
    }
    public async Task<List<Category>> GetCategories()
    {
        return await _context.Categories.ToListAsync();
    }
}
