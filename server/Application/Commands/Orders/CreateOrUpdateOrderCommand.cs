using System;
using Application.Core;
using Application.DTOs;
using MediatR;


namespace Application.Commands.Orders;

public class CreateOrUpdateOrderCommand : IRequest<Result<OrderDto>>
{
    public required string UserId { get; set; }
    public CreateOrUpdateOrderDto CreateOrderDto { get; set; } = null!;
}
