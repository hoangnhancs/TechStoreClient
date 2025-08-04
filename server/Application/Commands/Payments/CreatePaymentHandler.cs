using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Payments;

public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, AppResult<PaymentDto>>
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public CreatePaymentHandler(IMapper mapper, IPaymentRepository paymentRepository, IOrderRepository orderRepository, IUnitOfWork unitOfWork)
    {
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<AppResult<PaymentDto>> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
    {
        var unCompleteOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);
        if (unCompleteOrder == null)
            return AppResult<PaymentDto>.Failure("Don't have any order to payment", 404);
        var payment = await _paymentRepository.CreatePaymentAsync(unCompleteOrder.Id, request.UserId, cancellationToken);
        if (payment == null)
            return AppResult<PaymentDto>.Failure("Payment creation failed", 500);
        var paymentDto = _mapper.Map<PaymentDto>(payment);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result)
            return AppResult<PaymentDto>.Failure("Payment creation failed", 500);
        return AppResult<PaymentDto>.Success(paymentDto);
    }
}
