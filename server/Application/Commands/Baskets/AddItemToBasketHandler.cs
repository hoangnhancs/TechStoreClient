using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;
using Persistence.Repositories;

namespace Application.Commands.Baskets;

public class AddItemToBasketHandler : IRequestHandler<AddItemToBasketCommand, AppResult<BasketDto>>
{

    private readonly IBasketRepository _basketRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserActionTrackingRepository _userActionTrackingRepository;
    private readonly IMapper _mapper;

    public AddItemToBasketHandler(IBasketRepository basketRepository, IProductRepository productRepository, IUnitOfWork unitOfWork,
            IMapper mapper, IUserActionTrackingRepository userActionTrackingRepository)
    {
        _basketRepository = basketRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userActionTrackingRepository = userActionTrackingRepository;
    }

    public async Task<AppResult<BasketDto>> Handle(AddItemToBasketCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return AppResult<BasketDto>.Failure("User ID cannot be null or empty", 400);
        }

        var product = await _productRepository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null) return AppResult<BasketDto>.Failure("Product not found", 404);

        var newBasket = await _basketRepository.AddItemToBasketAsync(request.UserId, request.ProductId, request.Quantity, cancellationToken);

        await _userActionTrackingRepository.AddUserActionTracking(new UserActionTracking
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            ActionType = UserActionTracking.UserActionType.AddToCart
        }, cancellationToken);

        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

        if (!result) return AppResult<BasketDto>.Failure("Don't have any update when add item", 400);

        

        return AppResult<BasketDto>.Success(_mapper.Map<BasketDto>(newBasket));
    }
}


