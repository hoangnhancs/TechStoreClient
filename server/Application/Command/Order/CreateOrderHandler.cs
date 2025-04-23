using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Order;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Result<OrderDto>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IBasketRepository _basketRepository;
    private readonly IUnitOfWork _unitOfWork;
    public CreateOrderHandler(IOrderRepository orderRepository, IUnitOfWork unitOfWork, IBasketRepository basketRepository)
    {
        _basketRepository = basketRepository;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<OrderDto>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var basket = await _basketRepository.GetBasketByUserIdAsync(request.UserId, cancellationToken);
        if (basket == null || basket.Items.Count == 0)
        {
            return Result<OrderDto>.Failure("Basket not available to create order", 404);
        }

        var order = await _orderRepository.GetOrderByBasketIdAsync(basket.Id);
        if (order != null)
        {
            return Result<OrderDto>.Failure("Order already exists", 400);
        }
        order = await _orderRepository.CreateOrderAsync(basket, request.UserId, request.AddressId);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return Result<OrderDto>.Failure("Problem when create order", 400);
        return Result<OrderDto>.Success(OrderMapper.MapToDto(order));
    }
}
