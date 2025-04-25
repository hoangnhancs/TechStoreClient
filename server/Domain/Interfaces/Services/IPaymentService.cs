using System;
using Domain.Entities;
using Stripe;

namespace Domain.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentIntent> CreateOrUpdatePaymentIntentAsync(Order order, string UserId, CancellationToken cancellationToken);
}
