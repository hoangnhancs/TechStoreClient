using System;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Queries.Orders;

public class GetOrderByUserIdQuery : IRequest<AppResult<List<OrderDto>>>
{
    public required string UserId { get; set; }
}
