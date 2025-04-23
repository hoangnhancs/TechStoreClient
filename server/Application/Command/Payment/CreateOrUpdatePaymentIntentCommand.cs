using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Command.Payment;

public class CreateOrUpdatePaymentIntentCommand : IRequest<Result<BasketDto>>
{
    public required string UserId { get; set; }
}
