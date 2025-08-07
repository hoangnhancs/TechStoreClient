using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IProductRepository
{
    Task<Product?> GetProductByIdAsync(string productId, CancellationToken cancellationToken);
    Task<Product?> GetProductByIdWithDetailFilterTagsAsync(string productId, CancellationToken cancellationToken);
    Task<List<Product>> GetTop10ProductPerCategory(CancellationToken cancellationToken);
    Task<List<Product>> GetAllProducts(CancellationToken cancellationToken);
    Task<List<Product>> GetProductsByCategory(int categoryId, CancellationToken cancellationToken);
    Task<Product> AddNewProduct(Product product, CancellationToken cancellationToken);
    Task UpdateProductAsync(Product product, DateTime? UpdatedAt, CancellationToken cancellationToken);
    Task UpdateProductQuantityAsync(string productId, int quantity, string mode, CancellationToken cancellationToken);//mode is add or subtract
    Task<List<string>> InventoryCheckAsync(List<OrderItem> orderItems, CancellationToken cancellationToken);
    Task<List<Product>> GetTop10SoldProducts(CancellationToken cancellationToken);
    // Task<List<Product>> GetAllProductWithEmbedVector(CancellationToken cancellationToken);
}
