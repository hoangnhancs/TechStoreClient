using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class PaymentRepository(StoreContext context) : IPaymentRepository
{
    private readonly StoreContext _context = context;
    public Task<Payment> CreatePaymentAsync(string orderId, string UserId, CancellationToken cancellationToken)
    {
        var payment = new Payment
        {
            UserId = UserId,
            OrderId = orderId,
            Status = Payment.PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.Payments.Add(payment);
        return Task.FromResult(payment);
    }

    public async Task<Payment?> GetPaymentByBasketIdAsync(string basketId, CancellationToken cancellationToken)
    {
        var orderId = await _context.Orders
            .Where(o => o.BasketId == basketId)
            .Select(o => o.Id)
            .FirstOrDefaultAsync(cancellationToken);
        return await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId, cancellationToken);
    }

    public Task<Payment> UpdatePaymentAsync(Payment payment, CancellationToken cancellationToken)
    {
        payment.UpdatedAt = DateTime.UtcNow;
        _context.Payments.Update(payment);
        return Task.FromResult(payment);
    }
}
