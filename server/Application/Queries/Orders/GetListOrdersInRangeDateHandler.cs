using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Orders;

public class GetListOrdersInRangeDateHandler : IRequestHandler<GetListOrdersInRangeDateQuery, AppResult<List<OrderDto>>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;
    public GetListOrdersInRangeDateHandler(IOrderRepository orderRepository, IMapper mapper)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<OrderDto>>> Handle(GetListOrdersInRangeDateQuery request, CancellationToken cancellationToken)
    {
        var orders = await _orderRepository.GetOrdersInRangeDateAsync(request.StartDate, request.EndDate);
        var ordersDto = orders.Select(_mapper.Map<OrderDto>).ToList();
        return AppResult<List<OrderDto>>.Success(ordersDto);
    }
}
