using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class ReviewRepository(StoreContext _context) : IReviewRepository
{
    public Task<Review> CreateReview(Review review, CancellationToken cancellationToken)
    {
        _context.Reviews.AddAsync(review, cancellationToken);
        return Task.FromResult(review);
    }

    public Task<Review?> GetReviewById(string reviewId, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Review>> GetReviewsByProductId(string productId, CancellationToken cancellationToken)
    {
        return await _context.Reviews
            .Where(r => r.ProductId == productId)
            .Include(r => r.User)
            .Include(r => r.Product) 
            .ToListAsync(cancellationToken);
    }
}
