using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Payments;

public class CreateOrUpdatePaymentIntentCommand : IRequest<AppResult<PaymentDto>>
{
    public required string UserId { get; set; }
}
