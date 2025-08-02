using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Reviews;

public class GetListReviewsByProductIdQuery : IRequest<AppResult<List<ReviewDto>>>
{
    public required string ProductId { get; set; }
}
