using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Payments;

public class UpdateCompletePaymentCommand : IRequest<AppResult<Unit>>
{
    public required string UserId { get; set; }
}
