using System;
using Application.Interface;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using Persistence;
using Stripe;

namespace Infrastructure.Service;

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
        //check payment on stripe
        //if not valid or not found, create a new one

        if (payment == null)
        {
            payment = await paymentRepository.CreatePaymentAsync(order.Id, UserId, cancellationToken);
            if (payment == null || subtotal <= 0)
            {
                if (payment == null)
                {
                    // Log chi tiết
                    Console.WriteLine($"Error: Payment creation failed for order ID: {order.Id}, User ID: {UserId}");
                }
                else
                {
                    // Log chi tiết
                    Console.WriteLine($"Error: Subtotal is zero or negative for order ID: {order.Id}. Items count: {order.Items.Count}, Subtotal: {subtotal}");
                }
                throw new InvalidOperationException($"Failed to create payment. Subtotal: {subtotal}, Payment: {(payment == null ? "null" : "not null")}");
            }
            await unitOfWork.CommitAsync(cancellationToken);
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

    public async Task<PaymentIntent> GetPaymentIntent(string paymentIntentId, CancellationToken cancellationToken)
    {
        var paymentIntentService = new PaymentIntentService();
        try
        {
            var paymentIntent = await paymentIntentService.GetAsync(
                paymentIntentId, cancellationToken: cancellationToken
            );
            return paymentIntent;
        }
        catch (Exception)
        {

            throw new ApplicationException("PaymentIntent not found.");
        }
    }
}
