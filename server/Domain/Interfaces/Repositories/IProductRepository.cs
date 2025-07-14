using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IProductRepository
{
    Task<Product?> GetProductByIdAsync(string productId, CancellationToken cancellationToken);
    Task<List<Product>> GetTop10ProductPerCategory(CancellationToken cancellationToken);
    Task<List<Product>> GetAllProducts(CancellationToken cancellationToken);
    Task<List<Product>> GetProductsByCategory(int categoryId, CancellationToken cancellationToken);
    Task<Product> AddNewProduct(Product product, CancellationToken cancellationToken);
}
