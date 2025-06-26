using System;
using System.Data.Common;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Order;

public class CreateOrUpdateOrderHandler : IRequestHandler<CreateOrUpdateOrderCommand, Result<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public CreateOrUpdateOrderHandler(IMapper mapper, IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<Result<OrderDto>> Handle(CreateOrUpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var uncompletedOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);
        var createOrderDto = request.CreateOrderDto;
        var orderDto = _mapper.Map<OrderDto>(createOrderDto);

        if (uncompletedOrder != null)
        {       
            var items = _mapper.Map<Domain.Entities.Order>(orderDto).Items.ToList();
            var newOrder = await _orderRepository.UpdateOrderAsync(uncompletedOrder.Id, items, orderDto.ShippingAddressId, orderDto.BillingAddressId, orderDto.ShippingCost, orderDto.Discount, orderDto.OrderStatus, orderDto.PaymentMethod, orderDto.PaymentStatus);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result)
            {
                return Result<OrderDto>.Failure("Failed to update order", 500);
            }
            var returnValue = _mapper.Map<OrderDto>(newOrder);
            return Result<OrderDto>.Success(returnValue);
        }
        else
        {
            var items = _mapper.Map<Domain.Entities.Order>(orderDto).Items.ToList();
            var newOrder = await _orderRepository.CreateOrderAsync(items, request.UserId, orderDto.ShippingAddressId, orderDto.BillingAddressId, orderDto.ShippingCost, orderDto.Discount);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result)
            {
                return Result<OrderDto>.Failure("Failed to update order", 500);
            }
            var returnValue = _mapper.Map<OrderDto>(newOrder);
            return Result<OrderDto>.Success(returnValue);
        }

    }
}
