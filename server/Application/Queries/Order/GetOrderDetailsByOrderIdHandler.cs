using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Order;

public class GetOrderDetailsByOrderIdHandler : IRequestHandler<GetOrderDetailsByOrderIdQuery, Result<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderDetailsByOrderIdHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Result<OrderDto>> Handle(GetOrderDetailsByOrderIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null) return Result<OrderDto>.Failure("Order not found", 404);
        return Result<OrderDto>.Success(OrderMapper.MapToDto(order));
    }
}

