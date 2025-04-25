using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IPaymentRepository
{
    Task<List<Payment>> GetPaymentByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task<Payment?> GetPaymentByOrderIdAsync(string orderId, CancellationToken cancellationToken);
    Task<Payment> CreatePaymentAsync(string orderId, string userId, CancellationToken cancellationToken);
    Task<Payment> UpdatePaymentAsync(Payment payment, CancellationToken cancellationToken);
}
