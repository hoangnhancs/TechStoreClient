using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Baskets;

public class RemoveItemFromBasketHandler : IRequestHandler<RemoveItemFromBasketCommand, AppResult<BasketDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBasketRepository _basketRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    public RemoveItemFromBasketHandler(IMapper mapper, IUnitOfWork unitOfWork, IBasketRepository basketRepository, IProductRepository productRepository)
    {
        _basketRepository = basketRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AppResult<BasketDto>> Handle(RemoveItemFromBasketCommand request, CancellationToken cancellationToken)
    {

        if (string.IsNullOrEmpty(request.UserId))
        {
            return AppResult<BasketDto>.Failure("User ID cannot be null or empty", 400);
        }

        var product = await _productRepository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null) return AppResult<BasketDto>.Failure("Product not found", 404);

        var newBasket = await _basketRepository.RemoveItemFromBasketAsync(request.UserId, request.ProductId, request.Quantity, cancellationToken);

        var result = await _unitOfWork.CommitAsync(cancellationToken);

        if (!result) return AppResult<BasketDto>.Failure("Don't have any update when remove item", 400);

        return AppResult<BasketDto>.Success(_mapper.Map<BasketDto>(newBasket));
    }
}
