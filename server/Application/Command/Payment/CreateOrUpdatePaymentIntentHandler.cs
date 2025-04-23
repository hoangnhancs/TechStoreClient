using System;
using Application.Core;
using Application.DTOs;
using Domain.Interfaces.Repositories;
using MediatR;
using Domain.Interfaces;
using Persistence;
using Domain.Interfaces.Services;
using Application.Mappers;

namespace Application.Command.Payment;

public class CreateOrUpdatePaymentIntentHandler : IRequestHandler<CreateOrUpdatePaymentIntentCommand, Result<BasketDto>>
{
    // private readonly IUnitOfWork _unitOfWork;
    // private readonly IBasketRepository _basketRepository;
    // private readonly IPaymentService _paymentService; 


    // public CreateOrUpdatePaymentIntentHandler(IUnitOfWork unitOfWork,IBasketRepository basketRepository, IPaymentService paymentService)
    // {
    //     _basketRepository = basketRepository;
    //     _paymentService = paymentService;
    //     _unitOfWork = unitOfWork;
    // }

    // public async Task<Result<BasketDto>> Handle(CreateOrUpdatePaymentIntentCommand request, CancellationToken cancellationToken)
    // {
    //     var basket = await _basketRepository.GetBasketByUserIdAsync(request.UserId, cancellationToken);

    //     if (basket == null)
    //         return Result<BasketDto>.Failure("Basket not found", 404);

    //     var intent = await _paymentService.CreateOrUpdatePaymentIntentAsync(basket, request.UserId, cancellationToken);

    //     if (intent == null)
    //         return Result<BasketDto>.Failure("Payment intent creation failed", 500);      

    //     if (basket.Payment != null)
    //     {
    //         basket.Payment.ClientSecret = intent.ClientSecret;
    //         basket.Payment.PaymentIntentId = intent.Id;
    //     }
    //     else
    //     {
    //         return Result<BasketDto>.Failure("Payment not initialized correctly", 500);
    //     }

    //     var result = await _unitOfWork.SaveChangesAsync(cancellationToken);

    //     return Result<BasketDto>.Success(BasketMapper.MapToDto(basket));
    // }
    public Task<Result<BasketDto>> Handle(CreateOrUpdatePaymentIntentCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}

