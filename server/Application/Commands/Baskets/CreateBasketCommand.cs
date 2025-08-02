using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Baskets;

public class CreateBasketCommand : IRequest<AppResult<Unit>>
{
    public required string UserId { get; set; }
}
