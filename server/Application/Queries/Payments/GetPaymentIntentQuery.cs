using System;
using Application.Core;
using MediatR;
using Stripe;

namespace Application.Queries.Payments;

public class GetPaymentIntentQuery : IRequest<AppResult<PaymentIntent>>
{
    public required string PaymentIntentId { get; set; }
}
