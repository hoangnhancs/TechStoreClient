using System;
using Application.Core;
using MediatR;

namespace Application.Command.Payment;

public class UpdateCompletePaymentCommand : IRequest<Result<Unit>>
{
    public required string UserId { get; set; }
}
