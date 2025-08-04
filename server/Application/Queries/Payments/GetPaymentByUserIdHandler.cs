using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Payments;

public class GetPaymentByUserIdHandler : IRequestHandler<GetPaymentByUserIdQuery, AppResult<List<PaymentDto>>>
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMapper _mapper;
    public GetPaymentByUserIdHandler(IMapper mapper, IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<PaymentDto>>> Handle(GetPaymentByUserIdQuery request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;
        var payment = await _paymentRepository.GetPaymentByUserIdAsync(userId, cancellationToken);
        if (payment == null)
            return AppResult<List<PaymentDto>>.Failure("Payment not found", 404);
        return AppResult<List<PaymentDto>>.Success(payment.Select(_mapper.Map<PaymentDto>).ToList());
    }
}

