using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Baskets;

public class GetBasketQuery : IRequest<Result<BasketDto>>
{
    public required string UserId { get; set; }
}
