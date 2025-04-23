using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Baskets;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, Result<BasketDto>>
{
    private readonly IBasketRepository _repository;

    public GetBasketHandler(IBasketRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<BasketDto>> Handle(GetBasketQuery request, CancellationToken cancellationToken)
    {
        var basket = await _repository.GetBasketByUserIdAsync(request.UserId, cancellationToken);

        if (basket == null)
        {
            return Result<BasketDto>.Failure("Basket not found", 404);
        }

        return Result<BasketDto>.Success(BasketMapper.MapToDto(basket));
    }
}
