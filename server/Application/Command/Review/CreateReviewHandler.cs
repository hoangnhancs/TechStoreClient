using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Review;

public class CreateReviewHandler : IRequestHandler<CreateReviewCommand, Result<ReviewDto>>
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    public CreateReviewHandler(IReviewRepository reviewRepository, IAccountRepository accountRepository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _reviewRepository = reviewRepository;
        _accountRepository = accountRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<ReviewDto>> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var userInfo = await _accountRepository.GetUserByIdAsync(request.UserId, cancellationToken);
        var review = new Domain.Entities.Review
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            User = userInfo,
            Rating = request.Rating,
            Comment = request.Comment
        };
        var createdReview = await _reviewRepository.CreateReview(review, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<ReviewDto>.Success(_mapper.Map<ReviewDto>(createdReview));
    }
}
