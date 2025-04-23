using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IProductRepository
{
    Task<Product?> GetProductByIdAsync(string productId, CancellationToken cancellationToken);
    Task<List<Product>> GetAllProductsAsync(CancellationToken cancellationToken);
}
