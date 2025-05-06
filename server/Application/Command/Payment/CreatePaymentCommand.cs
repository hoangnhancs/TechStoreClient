using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Command.Payment;

public class CreatePaymentCommand : IRequest<Result<PaymentDto>>
{
    public required string UserId { get; set; }

}
