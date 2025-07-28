using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Payments;

public class CreatePaymentCommand : IRequest<Result<PaymentDto>>
{
    public required string UserId { get; set; }

}
