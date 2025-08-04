using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Payments;

public class GetPaymentByUserIdQuery : IRequest<AppResult<List<PaymentDto>>>
{
 public required string UserId { get; set; } = null!;
}
