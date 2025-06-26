using System;
using Domain.Entities;
using Stripe;

namespace Application.Interface;

public interface IPaymentService
{
    Task<PaymentIntent> CreateOrUpdatePaymentIntentAsync(Order order, string UserId, CancellationToken cancellationToken);
    Task<PaymentIntent> GetPaymentIntent(string paymentIntentId, CancellationToken cancellationToken);
}
