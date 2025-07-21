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
    private readonly IProductRepository _productRepository;
    public CreateOrUpdateOrderHandler(IMapper mapper, IOrderRepository orderRepository, IUnitOfWork unitOfWork, IProductRepository productRepository)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _productRepository = productRepository;
    }
    public async Task<Result<OrderDto>> Handle(CreateOrUpdateOrderCommand request, CancellationToken cancellationToken)
    {
        var uncompletedOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);
        var orderItemsDto = request.CreateOrderDto.Items;  
        var createOrderDto = request.CreateOrderDto;
        var orderDto = _mapper.Map<OrderDto>(createOrderDto);
        var items = _mapper.Map<Domain.Entities.Order>(orderDto).Items.ToList();
        var errorMessages = _productRepository.InventoryCheckAsync(items, cancellationToken).Result;
        if (errorMessages.Count > 0)
        {
            return Result<OrderDto>.Failure(string.Join("\n", errorMessages), 400);
        }

        if (uncompletedOrder != null)
        {
            // var items = _mapper.Map<Domain.Entities.Order>(orderDto).Items.ToList();
            var newOrder = await _orderRepository.UpdateOrderAsync(uncompletedOrder.Id, items, orderDto.ShippingAddressId, orderDto.BillingAddressId, orderDto.ShippingCost, orderDto.Discount, orderDto.OrderStatus, orderDto.PaymentMethod, orderDto.PaymentStatus);
            if (orderDto.OrderStatus == "Completed" || orderDto.PaymentStatus == "Paid")
            {
                foreach (var item in newOrder.Items)
                {
                    var product = await _productRepository.GetProductByIdAsync(item.ProductId, cancellationToken);
                    if (product == null) throw new Exception("Product not found");
                    product.QuantityInStock -= item.Quantity;
                    product.UnitSold += item.Quantity;
                    await _productRepository.UpdateProductAsync(product, null, cancellationToken);
                    // await _productRepository.UpdateProductQuantityAsync(item.ProductId, item.Quantity, "sub", cancellationToken);
                }
            }

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
            // var items = _mapper.Map<Domain.Entities.Order>(orderDto).Items.ToList();
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
