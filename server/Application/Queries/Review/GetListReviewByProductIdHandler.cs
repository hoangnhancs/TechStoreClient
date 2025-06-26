using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Review;

public class GetListReviewByProductIdHandler : IRequestHandler<GetListReviewsByProductIdQuery, Result<List<ReviewDto>>>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IMapper _mapper;
    public GetListReviewByProductIdHandler(IReviewRepository reviewRepository, IMapper mapper)
    {
        _reviewRepository = reviewRepository;
        _mapper = mapper;
    }
    public async Task<Result<List<ReviewDto>>> Handle(GetListReviewsByProductIdQuery request, CancellationToken cancellationToken)
    {
        var reviews = await _reviewRepository.GetReviewsByProductId(request.ProductId, cancellationToken);
        if (reviews == null || reviews.Count == 0)
        {
            return Result<List<ReviewDto>>.Failure("No reviews found for the specified product.", 404);
        }
        var reviewsDto = reviews.Select(_mapper.Map<ReviewDto>).ToList();
        return Result<List<ReviewDto>>.Success(reviewsDto);
    }
}
