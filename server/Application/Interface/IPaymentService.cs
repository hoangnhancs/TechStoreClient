using System;
using Application.DTOs;
using Domain.Entities;


namespace Application.Interface;

public interface IPaymentService
{
    Task<PaymentIntentDto> CreateOrUpdatePaymentIntentAsync(Order order, string UserId, CancellationToken cancellationToken);
    // Task<PaymentIntent> GetPaymentIntent(string paymentIntentId, CancellationToken cancellationToken);
}
