using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class OrderRepository(StoreContext context) : IOrderRepository
{
    private readonly StoreContext _context = context;
    public async Task<Order?> GetOrderByIdAsync(string orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(o => o.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        return order;
    }
    public async Task<List<Order>> GetOrdersByUserIdAsync(string userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
            .ThenInclude(o => o.Product) 
            .ToListAsync();
        return orders;
    }
    public Task<Order> CreateOrderAsync(List<OrderItem> items, string userId, string? shippingAddressId, string? billingAddressId, long shippingcost, long discount)
    {
        shippingAddressId = string.IsNullOrWhiteSpace(shippingAddressId) ? null : shippingAddressId;
        billingAddressId = string.IsNullOrWhiteSpace(billingAddressId) ? null : billingAddressId;
        var order = new Order
        {
            UserId = userId,
            Items = items,
            PaymentStatus = PaymentStatus.Pending,
            OrderStatus = OrderStatus.Created,
            ShippingAddressId = shippingAddressId ,
            BillingAddressId = billingAddressId ,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            SubToTal = items.Sum(x => x.UnitPrice  * x.Quantity),
            ShippingCost = shippingcost,
            Discount = discount,
            Total = items.Sum(x => x.UnitPrice * x.Quantity) + shippingcost - discount,
            PaymentMethod = PaymentMethod.NotSelected,
        };

        foreach (var item in order.Items)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);
            item.Product = product;
        }

        _context.Orders.Add(order);
        return Task.FromResult(order);
    }

    public async Task<Order> UpdateOrderAsync(string orderId, List<OrderItem> items, string? shippingAddressId, string? billingingAddressId, long shippingcost, long discount, string orderStatus, string paymentMethod, string paymentStatus)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null) throw new InvalidOperationException("Order not found");
        order.UpdatedAt = DateTime.UtcNow;
        order.Items = items;
        order.ShippingAddressId = shippingAddressId;
        order.BillingAddressId = billingingAddressId;
        order.ShippingCost = shippingcost;
        order.Discount = discount;
        order.SubToTal = items.Sum(x => x.UnitPrice * x.Quantity);
        order.Total = items.Sum(x => x.UnitPrice * x.Quantity) + shippingcost - discount;
        order.OrderStatus = Enum.Parse<OrderStatus>(orderStatus);
        order.PaymentMethod = Enum.Parse<PaymentMethod>(paymentMethod);
        order.PaymentStatus = Enum.Parse<PaymentStatus>(paymentStatus);
        return order;
    }

    public async Task<Order?> GetUnCompletedOrdersByUserIdAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(o => o.Product)
            .Where(o => o.UserId == userId && o.OrderStatus != OrderStatus.Completed)
            .FirstOrDefaultAsync();
    }
    public void AttachProduct(Product product)
    {
        _context.Products.Attach(product);
    }

    public async Task<Order> GetOrderDetailById(string orderId)
    {
        var orderDetails = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(o => o.Product)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (orderDetails == null) throw new InvalidOperationException("Order not found");
        return orderDetails;
    }

    public async Task<List<Order>> GetOrdersInRangeDateAsync(DateTime startDate, DateTime endDate)
    {
        var startDateUtc = startDate.ToUniversalTime();
        var endDateUtc = endDate.ToUniversalTime();
        var orders = await _context.Orders
            .Where(o => o.UpdatedAt >= startDateUtc && o.UpdatedAt <= endDateUtc)
            .Include(o => o.Items)
            .ThenInclude(o => o.Product)
            .Include(o => o.User)
            .ToListAsync();
        return orders;
    }
}

