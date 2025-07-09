using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;
using Persistence.Repositories;

namespace Application.Command.Baskets;

public class AddItemToBasketHandler : IRequestHandler<AddItemToBasketCommand, Result<BasketDto>>
{

    private readonly IBasketRepository _basketRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddItemToBasketHandler(IBasketRepository basketRepository, IProductRepository productRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _basketRepository = basketRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<BasketDto>> Handle(AddItemToBasketCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
        {
            return Result<BasketDto>.Failure("User ID cannot be null or empty", 400);
        }

        var product = await _productRepository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null) return Result<BasketDto>.Failure("Product not found", 404);

        var newBasket = await _basketRepository.AddItemToBasketAsync(request.UserId, request.ProductId, request.Quantity, cancellationToken);

        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

        if (!result) return Result<BasketDto>.Failure("Don't have any update when add item", 400);

        

        return Result<BasketDto>.Success(_mapper.Map<BasketDto>(newBasket));
    }
}


