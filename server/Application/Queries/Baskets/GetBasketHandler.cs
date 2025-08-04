using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Baskets;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, AppResult<BasketDto>>
{
    private readonly IBasketRepository _repository;
    private readonly IMapper _mapper;

    public GetBasketHandler(IMapper mapper, IBasketRepository repository)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<AppResult<BasketDto>> Handle(GetBasketQuery request, CancellationToken cancellationToken)
    {
        var basket = await _repository.GetBasketByUserIdAsync(request.UserId, cancellationToken);

        if (basket == null)
        {
            return AppResult<BasketDto>.Failure("Basket not found", 404);
        }

        return AppResult<BasketDto>.Success(_mapper.Map<BasketDto>(basket));
    }
}
