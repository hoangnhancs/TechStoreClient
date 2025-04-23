using System;
using Domain.Entities;
using Stripe;

namespace Domain.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentIntent> CreateOrUpdatePaymentIntentAsync(Basket basket, string UserId, CancellationToken cancellationToken);
}
