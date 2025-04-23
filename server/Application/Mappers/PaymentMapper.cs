using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class PaymentMapper
{
    public static PaymentDto MapToDto(Payment payment)
    {
        return new PaymentDto
        {
            OrderId = payment.OrderId,
            PaymentIntentId = payment.PaymentIntentId,
            ClientSecret = payment.ClientSecret,
            Status = payment.Status.ToString(),
        };
    }
}
