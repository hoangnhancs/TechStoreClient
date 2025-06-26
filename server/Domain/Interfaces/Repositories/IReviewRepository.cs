using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IReviewRepository
{
    Task<Review> CreateReview(Review review, CancellationToken cancellationToken);
    Task<Review?> GetReviewById(string reviewId, CancellationToken cancellationToken);
    Task<List<Review>> GetReviewsByProductId(string productId, CancellationToken cancellationToken);
}
