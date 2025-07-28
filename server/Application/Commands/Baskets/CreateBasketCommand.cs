using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Baskets;

public class CreateBasketCommand : IRequest<Result<Unit>>
{
    public required string UserId { get; set; }
}
