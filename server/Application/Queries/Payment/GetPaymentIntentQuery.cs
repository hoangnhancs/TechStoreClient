using System;
using Application.Core;
using MediatR;
using Stripe;

namespace Application.Queries.Payment;

public class GetPaymentIntentQuery : IRequest<Result<PaymentIntent>>
{
    public required string PaymentIntentId { get; set; }
}
