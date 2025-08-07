using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class ProductVectorEmbeddingRepository(StoreContext context) : IProductVectorEmbeddingRepository
{
    private readonly StoreContext _context = context;

    public async Task<ProductVectorEmbedding?> GetProductVectorEmbeddingByProductId(string productId, CancellationToken cancellationToken)
    {
        return await _context.ProductVectorEmbeddings.FirstOrDefaultAsync(p => p.ProductId == productId, cancellationToken);
    }

    public async Task<List<ProductVectorEmbedding>> GetProductVectorEmbeddingsByProductIds(HashSet<string> productIds, CancellationToken cancellationToken)
    {
        return await _context.ProductVectorEmbeddings.Where(p => productIds.Contains(p.ProductId)).ToListAsync(cancellationToken);
    }

    public async Task UpdateProductVectorEmbedding(string productId, string vector)
    {
        var product = await _context.ProductVectorEmbeddings.FirstOrDefaultAsync(p => p.ProductId == productId);
        if (product != null)
        {
            product.EmbeddingJson = vector;
        }
    }
}
