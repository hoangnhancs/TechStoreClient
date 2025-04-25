using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Order;

public class GetOrderByUserIdHandler : IRequestHandler<GetOrderByUserIdQuery, Result<List<OrderDto>>>
{
    private readonly IOrderRepository _orderRepository;
    public GetOrderByUserIdHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;

    }

    public async Task<Result<List<OrderDto>>> Handle(GetOrderByUserIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrdersByUserIdAsync(request.UserId);
        if (order == null || order.Count == 0)
        {
            return Result<List<OrderDto>>.Failure("Order not found", 404);
        }

        return Result<List<OrderDto>>.Success(order.Select(OrderMapper.MapToDto).ToList());
    }
}
