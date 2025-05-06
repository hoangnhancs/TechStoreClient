using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Baskets;

public class RemovePermanentItemsFromBasketHandler : IRequestHandler<RemovePermanentItemsFromBasketCommand, Result<BasketDto>>
{
    private readonly IBasketRepository _basketRepository;
    private readonly IUnitOfWork _unitOfWork;
    public RemovePermanentItemsFromBasketHandler(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
    {
        _basketRepository = basketRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<BasketDto>> Handle(RemovePermanentItemsFromBasketCommand request, CancellationToken cancellationToken)
    {
        var basket = await _basketRepository.GetBasketByUserIdAsync(request.UserId, cancellationToken);
        if (basket == null)
            return Result<BasketDto>.Failure("Basket not found", 404);
        var newBasket = await _basketRepository.RemovePermanentItemsFromBasketAsync(request.UserId, request.ProductIds, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return Result<BasketDto>.Failure("Don't have any update when remove item", 400);
        return Result<BasketDto>.Success(BasketMapper.MapToDto(newBasket));
    }
}
