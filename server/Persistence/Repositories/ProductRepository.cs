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
            .Include(p => p.ProductTagFilters!)
            .ThenInclude(p => p.FilterTagValue)
            .Include(p => p.Reviews)
            .Include(p => p.DetailImages)
            .Include(p => p.Attributes)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Product>> GetAllProducts(CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.IsActive)
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
                WHERE is_active = true
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
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.DisplayTags)
            .Include(p => p.ProductTagFilters)
            .ToListAsync(cancellationToken);
    }

    public async Task<Product> AddNewProduct(Product product, CancellationToken cancellationToken)
    {
        await _context.Products.AddAsync(product, cancellationToken);
        return product;
    }

    public async Task UpdateProductAsync(Product product, DateTime? UpdatedAt, CancellationToken cancellationToken)
    {
        var existProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == product.Id, cancellationToken);
        if (existProduct == null)
        {
            throw new Exception("Product not found");
        }

        existProduct.Name = product.Name;
        existProduct.Description = product.Description;
        existProduct.Price = product.Price;
        existProduct.OldPrice = product.OldPrice;
        existProduct.DiscountPercentage = product.DiscountPercentage;
        existProduct.QuantityInStock = product.QuantityInStock;
        existProduct.CategoryId = product.CategoryId;
        if (UpdatedAt.HasValue)
        {
            existProduct.UpdatedAt = UpdatedAt.Value;
        }
        existProduct.MainImageUrl = product.MainImageUrl;
        existProduct.MainImagePublicId = product.MainImagePublicId;
        existProduct.DetailImages = product.DetailImages;
        existProduct.Attributes = product.Attributes;
        existProduct.ProductTagFilters = product.ProductTagFilters;   
        // existProduct = product;
    }

    public async Task UpdateProductQuantityAsync(string productId, int quantity, string Mode, CancellationToken cancellationToken)
    {
        var existProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
        if (existProduct == null)
        {
            throw new Exception("Product not found");
        }

        if (Mode == "add")
        {
            existProduct.QuantityInStock += quantity;
        }
        else if (Mode == "sub")
        {
            existProduct.QuantityInStock -= quantity;
        }
    }

    public async Task<List<string>> InventoryCheckAsync(List<OrderItem> orderItems, CancellationToken cancellationToken)
    {
        var messages = new List<string>();
        foreach (var item in orderItems)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId && p.IsActive, cancellationToken);
            if (product == null)
            {
                messages.Add($"Sản phẩm với ID {item.ProductId} không tồn tại.");
                continue;
            }
            if (product.QuantityInStock < item.Quantity)
            {
                messages.Add($"Sản phẩm '{product.Name}' chỉ còn {product.QuantityInStock} cái trong kho.");
            }
        }
        return messages;
    }
}