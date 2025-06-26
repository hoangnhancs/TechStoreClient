using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Order;

public class GetOrderDetailsByOrderIdHandler : IRequestHandler<GetOrderDetailsByOrderIdQuery, Result<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public GetOrderDetailsByOrderIdHandler(IMapper mapper, IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    public async Task<Result<OrderDto>> Handle(GetOrderDetailsByOrderIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null) return Result<OrderDto>.Failure("Order not found", 404);
        return Result<OrderDto>.Success(_mapper.Map<OrderDto>(order));
    }
}

