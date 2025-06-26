using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Baskets;

public class GetBasketHandler : IRequestHandler<GetBasketQuery, Result<BasketDto>>
{
    private readonly IBasketRepository _repository;
    private readonly IMapper _mapper;

    public GetBasketHandler(IMapper mapper, IBasketRepository repository)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<BasketDto>> Handle(GetBasketQuery request, CancellationToken cancellationToken)
    {
        var basket = await _repository.GetBasketByUserIdAsync(request.UserId, cancellationToken);

        if (basket == null)
        {
            return Result<BasketDto>.Failure("Basket not found", 404);
        }

        return Result<BasketDto>.Success(_mapper.Map<BasketDto>(basket));
    }
}
