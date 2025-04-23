using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IPaymentRepository
{
    Task<Payment?> GetPaymentByBasketIdAsync(string basketId, CancellationToken cancellationToken);
    Task<Payment> CreatePaymentAsync(string orderId, string userId, CancellationToken cancellationToken);
    Task<Payment> UpdatePaymentAsync(Payment payment, CancellationToken cancellationToken);
}
