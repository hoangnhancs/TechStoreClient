using System;
using Application.Core;
using Application.Interface;
using MediatR;
using Stripe;

namespace Application.Queries.Payments;

public class GetPaymentIntentHandler : IRequestHandler<GetPaymentIntentQuery, AppResult<PaymentIntent>>
{
    private readonly IPaymentService _paymentService;
    public GetPaymentIntentHandler(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    public async Task<AppResult<PaymentIntent>> Handle(GetPaymentIntentQuery request, CancellationToken cancellationToken)
    {
        var paymentIntent = await _paymentService.GetPaymentIntent(request.PaymentIntentId, cancellationToken);
        if (paymentIntent == null) return AppResult<PaymentIntent>.Failure("Payment intent not found", 404);
        return AppResult<PaymentIntent>.Success(paymentIntent);
    }
}
