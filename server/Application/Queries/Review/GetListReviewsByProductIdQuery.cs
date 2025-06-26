using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Review;

public class GetListReviewsByProductIdQuery : IRequest<Result<List<ReviewDto>>>
{
    public required string ProductId { get; set; }
}
