using Domain;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class ProductRepository(StoreContext context) : IProductRepository
{
    private readonly StoreContext _context = context;

    public async Task<Product?> GetProductByIdAsync(string productId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.Id == productId)
            .Include(p => p.Category)
            .Include(p => p.DisplayTags)
            .Include(p => p.ProductTagFilters)
            .Include(p => p.Reviews)
            .Include(p => p.DetailImages)
            .Include(p => p.Attributes)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Product>> GetAllProducts(CancellationToken cancellationToken)
    {
        return await _context.Products
            .Include(p => p.Category)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> GetTop10ProductPerCategory(CancellationToken cancellationToken)
    {
        // var sqlQuery = @"
        //     SELECT topProducts.*
        //     FROM (
        //         SELECT DISTINCT CategoryId FROM Products
        //     ) AS c
        //     CROSS APPLY (
        //         SELECT TOP 10 *
        //         FROM Products as p
        //         WHERE p.CategoryId = c.CategoryId
        //         ORDER BY p.CreatedAt DESC
        //     ) AS topProducts";
        var sqlQuery = @"
            SELECT *
            FROM (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at DESC) as rn
                FROM products
            ) as topProducts
            WHERE rn <= 10
        ";
        return await _context.Products
            .FromSqlRaw(sqlQuery)
            .Include(p => p.Category)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Product>> GetProductsByCategory(int categoryId, CancellationToken cancellationToken)
    {
        return await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.DisplayTags)
            .Include(p => p.ProductTagFilters)
            .ToListAsync(cancellationToken);
    }
}