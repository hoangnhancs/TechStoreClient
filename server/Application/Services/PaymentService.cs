using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Persistence;
using Stripe;

namespace Application.Services;

public class PaymentService(IConfiguration config, IPaymentRepository paymentRepository) : IPaymentService
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntentAsync(Basket basket, string UserId, CancellationToken cancellationToken)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();
        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(item => item.Product.Price * item.Quantity);
        var deliveryFee = 1000;
        var discount = 3000;
        var payment = await paymentRepository.GetPaymentByBasketIdAsync(basket.Id, cancellationToken);

        if (payment == null)
        {
            payment = await paymentRepository.CreatePaymentAsync(basket.Id, UserId, cancellationToken);
            if (payment == null)
            {
                throw new InvalidOperationException("Failed to create payment.");
            }
        }

        if (string.IsNullOrEmpty(payment.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee - discount,
                Currency = "vnd",
                PaymentMethodTypes = ["card"],
            };
            intent = await service.CreateAsync(options, cancellationToken: cancellationToken);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee - discount,
            };
            intent = await service.UpdateAsync(payment.PaymentIntentId, options, cancellationToken: cancellationToken);
        }

        return intent;
        
    }
}
