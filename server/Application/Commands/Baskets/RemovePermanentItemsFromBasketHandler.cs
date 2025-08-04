using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Baskets;

public class RemovePermanentItemsFromBasketHandler : IRequestHandler<RemovePermanentItemsFromBasketCommand, AppResult<BasketDto>>
{
    private readonly IBasketRepository _basketRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public RemovePermanentItemsFromBasketHandler(IMapper mapper, IBasketRepository basketRepository, IUnitOfWork unitOfWork)
    {
        _basketRepository = basketRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<AppResult<BasketDto>> Handle(RemovePermanentItemsFromBasketCommand request, CancellationToken cancellationToken)
    {
        var basket = await _basketRepository.GetBasketByUserIdAsync(request.UserId, cancellationToken);
        if (basket == null)
            return AppResult<BasketDto>.Failure("Basket not found", 404);
        var newBasket = await _basketRepository.RemovePermanentItemsFromBasketAsync(request.UserId, request.ProductIds, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return AppResult<BasketDto>.Failure("Don't have any update when remove item", 400);
        return AppResult<BasketDto>.Success(_mapper.Map<BasketDto>(newBasket));
    }
}
