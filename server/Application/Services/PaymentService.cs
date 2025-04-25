using System;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Persistence;
using Stripe;

namespace Application.Services;

public class PaymentService(IConfiguration config, IPaymentRepository paymentRepository, IUnitOfWork unitOfWork) : IPaymentService
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntentAsync(Order order, string UserId, CancellationToken cancellationToken)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();
        var intent = new PaymentIntent();

        if (order == null)
        {
            throw new InvalidOperationException("Order not found.");
        }

        var subtotal = order.Items.Sum(item => item.UnitPrice * item.Quantity);
        var deliveryFee = order.ShippingCost;
        var discount = order.Discount;
        var payment = await paymentRepository.GetPaymentByOrderIdAsync(order.Id, cancellationToken);

        if (payment == null)
        {
            payment = await paymentRepository.CreatePaymentAsync(order.Id, UserId, cancellationToken);
            if (payment == null || subtotal <= 0)
            {
                throw new InvalidOperationException("Failed to create payment.");
            }
            await unitOfWork.SaveChangesAsync(cancellationToken);
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

        return intent ?? throw new InvalidOperationException("PaymentIntent creation or update failed.");

    }
}
