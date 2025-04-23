using System;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Command.Order;

public class CreateOrderCommand : IRequest<Result<OrderDto>>
{
    public required string UserId { get; set; }
    public required string AddressId { get; set; }
}
