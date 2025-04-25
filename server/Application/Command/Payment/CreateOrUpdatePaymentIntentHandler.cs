using System;
using Application.Core;
using Application.DTOs;
using Domain.Interfaces.Repositories;
using MediatR;
using Domain.Interfaces;
using Persistence;
using Domain.Interfaces.Services;
using Application.Mappers;
using Microsoft.CodeAnalysis.CSharp;

namespace Application.Command.Payment;

public class CreateOrUpdatePaymentIntentHandler : IRequestHandler<CreateOrUpdatePaymentIntentCommand, Result<PaymentDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBasketRepository _basketRepository;
    private readonly IPaymentService _paymentService; 
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;


    public CreateOrUpdatePaymentIntentHandler(IUnitOfWork unitOfWork,IBasketRepository basketRepository, IPaymentService paymentService, IPaymentRepository paymentRepository, IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
        _basketRepository = basketRepository;
        _paymentService = paymentService;
        _unitOfWork = unitOfWork;
        _paymentRepository = paymentRepository;
    }

    public async Task<Result<PaymentDto>> Handle(CreateOrUpdatePaymentIntentCommand request, CancellationToken cancellationToken)
    {

    

        var unCompletedOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);

        if (unCompletedOrder == null)
            return Result<PaymentDto>.Failure("Don't have any order to payment", 404);



        var intent = await _paymentService.CreateOrUpdatePaymentIntentAsync(unCompletedOrder, request.UserId, cancellationToken); 
        //trong nay da create and save payment neu chua co



        if (intent == null)
            return Result<PaymentDto>.Failure("Payment intent creation failed", 500);      

        var payment = await _paymentRepository.GetPaymentByOrderIdAsync(unCompletedOrder.Id, cancellationToken);

        if (payment != null)
        {
            payment.ClientSecret = intent.ClientSecret;
            payment.PaymentIntentId = intent.Id;
        }
        else
        {
            return Result<PaymentDto>.Failure("Payment not initialized correctly", 500);
        }


        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<PaymentDto>.Success(PaymentMapper.MapToDto(payment));

    }
    
}

