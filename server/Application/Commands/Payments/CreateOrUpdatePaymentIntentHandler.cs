using System;
using Application.Core;
using Application.DTOs;
using Domain.Interfaces.Repositories;
using MediatR;
using Domain.Interfaces;
using Persistence;
using Application.Mappers;
using Microsoft.CodeAnalysis.CSharp;
using AutoMapper;
using Application.Interface;

namespace Application.Commands.Payments;

public class CreateOrUpdatePaymentIntentHandler : IRequestHandler<CreateOrUpdatePaymentIntentCommand, AppResult<PaymentDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBasketRepository _basketRepository;
    private readonly IPaymentService _paymentService;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public CreateOrUpdatePaymentIntentHandler(IMapper mapper, IUnitOfWork unitOfWork, IBasketRepository basketRepository, IPaymentService paymentService, IPaymentRepository paymentRepository, IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
        _basketRepository = basketRepository;
        _paymentService = paymentService;
        _unitOfWork = unitOfWork;
        _paymentRepository = paymentRepository;
        _mapper = mapper;
    }

    public async Task<AppResult<PaymentDto>> Handle(CreateOrUpdatePaymentIntentCommand request, CancellationToken cancellationToken)
    {



        var unCompletedOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);

        if (unCompletedOrder == null)
            return AppResult<PaymentDto>.Failure("Don't have any order to payment", 404);



        var intent = await _paymentService.CreateOrUpdatePaymentIntentAsync(unCompletedOrder, request.UserId, cancellationToken);



        if (intent == null)
            return AppResult<PaymentDto>.Failure("Payment intent creation failed", 500);

        var payment = await _paymentRepository.GetPaymentByOrderIdAsync(unCompletedOrder.Id, cancellationToken);

        if (payment != null)
        {
            payment.ClientSecret = intent.ClientSecret;
            payment.PaymentIntentId = intent.Id;
            payment.CreatedAt = payment.CreatedAt;
            payment.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            return AppResult<PaymentDto>.Failure("Payment not initialized correctly", 500);
        }


        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

        return AppResult<PaymentDto>.Success(_mapper.Map<PaymentDto>(payment));

    }

}

