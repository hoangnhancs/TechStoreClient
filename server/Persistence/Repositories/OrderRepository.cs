using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class OrderRepository(StoreContext context) : IOrderRepository
{
    private readonly StoreContext _context = context;

    public async Task<Order?> GetOrderByBasketIdAsync(string basketId)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.BasketId == basketId);
        return order;
    }
    public Task<Order> CreateOrderAsync(Basket basket, string userId, string addressId)
    {
        var order = new Order
        {
            UserId = userId,
            BasketId = basket.Id,
            PaymentStatus = PaymentStatus.Paid,
            OrderStatus = OrderStatus.Created,
            ShippingAddressId = addressId,
            BillingAddressId = addressId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            SubToTal = basket.Items.Sum(x => x.Product.Price * x.Quantity),
            ShippingCost = 1000,
            Total = basket.Items.Sum(x => x.Product.Price * x.Quantity) + 1000,
            PaymentMethod = PaymentMethod.CashOnDelivery,
        };

        _context.Orders.Add(order);
        return Task.FromResult(order);
    }
}

