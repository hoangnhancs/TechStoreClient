using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IProductVectorEmbeddingRepository
{
    Task UpdateProductVectorEmbedding(string productId, string vector);
    Task<ProductVectorEmbedding?> GetProductVectorEmbeddingByProductId(string productId, CancellationToken cancellationToken);
    Task<List<ProductVectorEmbedding>> GetProductVectorEmbeddingsByProductIds(HashSet<string> productIds, CancellationToken cancellationToken); // List<ProductVectorEmbedding> GetProductVectorEmbeddingsAsync(CancellationToken cancellationToken);
    
}
