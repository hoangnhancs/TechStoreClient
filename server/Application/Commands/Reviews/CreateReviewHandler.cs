using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Reviews;

public class CreateReviewHandler : IRequestHandler<CreateReviewCommand, AppResult<ReviewDto>>
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
    public async Task<AppResult<ReviewDto>> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var userInfo = await _accountRepository.GetUserByIdAsync(request.UserId, cancellationToken);
        var review = new Review
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            User = userInfo,
            Rating = request.Rating,
            Comment = request.Comment
        };
        var createdReview = await _reviewRepository.CreateReview(review, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
        return AppResult<ReviewDto>.Success(_mapper.Map<ReviewDto>(createdReview));
    }
}
