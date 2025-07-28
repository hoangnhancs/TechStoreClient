using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Baskets;

public class RemovePermanentItemsFromBasketCommand : IRequest<Result<BasketDto>>
{
    public required string UserId {get; set; }
    public required List<string> ProductIds { get; set; } = [];
}
