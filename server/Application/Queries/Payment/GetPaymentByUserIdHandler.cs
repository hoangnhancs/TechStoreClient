using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Payment;

public class GetPaymentByUserIdHandler : IRequestHandler<GetPaymentByUserIdQuery, Result<List<PaymentDto>>>
{
    private readonly IPaymentRepository _paymentRepository;
    public GetPaymentByUserIdHandler(IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }
    public async Task<Result<List<PaymentDto>>> Handle(GetPaymentByUserIdQuery request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        var payment = await _paymentRepository.GetPaymentByUserIdAsync(userId, cancellationToken);
        if (payment == null)
            return Result<List<PaymentDto>>.Failure("Payment not found", 404);
        return Result<List<PaymentDto>>.Success(payment.Select(PaymentMapper.MapToDto).ToList());
    }
}

