using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Orders;

public class GetOrderDetailsByOrderIdHandler : IRequestHandler<GetOrderDetailsByOrderIdQuery, AppResult<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public GetOrderDetailsByOrderIdHandler(IMapper mapper, IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    public async Task<AppResult<OrderDto>> Handle(GetOrderDetailsByOrderIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderByIdAsync(request.OrderId);
        if (order == null) return AppResult<OrderDto>.Failure("Order not found", 404);
        return AppResult<OrderDto>.Success(_mapper.Map<OrderDto>(order));
    }
}

