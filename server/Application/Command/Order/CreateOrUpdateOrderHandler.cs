using System;
using System.Data.Common;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Order;

public class CreateOrUpdateOrderHandler : IRequestHandler<CreateOrUpdateOrderCommand, Result<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    public CreateOrUpdateOrderHandler(IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<OrderDto>> Handle(CreateOrUpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var uncompletedOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);
        var createOrderDto = request.CreateOrderDto;
        var orderDto = OrderMapper.MapToDto(createOrderDto);

        if (uncompletedOrder != null)
        {       
            var items = OrderMapper.MapToEntity(orderDto).Items.ToList();
            var newOrder = await _orderRepository.UpdateOrderAsync(uncompletedOrder.Id, items, orderDto.ShippingAddressId ?? string.Empty, orderDto.BillingAddressId ?? string.Empty, orderDto.ShippingCost, orderDto.Discount, orderDto.OrderStatus, orderDto.PaymentMethod, orderDto.PaymentStatus);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result)
            {
                return Result<OrderDto>.Failure("Failed to update order", 500);
            }
            var returnValue = OrderMapper.MapToDto(newOrder);
            return Result<OrderDto>.Success(returnValue);
        }
        else
        {
            var items = OrderMapper.MapToEntity(orderDto).Items.ToList();
            var newOrder = await _orderRepository.CreateOrderAsync(items, request.UserId, orderDto.ShippingAddressId ?? string.Empty, orderDto.BillingAddressId ?? string.Empty, orderDto.ShippingCost, orderDto.Discount);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result)
            {
                return Result<OrderDto>.Failure("Failed to update order", 500);
            }
            var returnValue = OrderMapper.MapToDto(newOrder);
            return Result<OrderDto>.Success(returnValue);
        }

    }
}
