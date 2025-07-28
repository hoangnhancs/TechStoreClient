using System;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Queries.Orders;

public class GetOrderByUserIdQuery : IRequest<Result<List<OrderDto>>>
{
    public required string UserId { get; set; }
}
