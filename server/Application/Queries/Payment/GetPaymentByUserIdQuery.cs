using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Payment;

public class GetPaymentByUserIdQuery : IRequest<Result<List<PaymentDto>>>
{
 public required string UserId { get; set; } = null!;
}
