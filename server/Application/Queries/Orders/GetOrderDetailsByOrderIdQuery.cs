using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Orders;

public class GetOrderDetailsByOrderIdQuery : IRequest<Result<OrderDto>>
{
    public required string OrderId { get; set; }
}
