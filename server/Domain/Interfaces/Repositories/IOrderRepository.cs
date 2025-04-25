using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order?> GetOrderByIdAsync(string id);
    Task<List<Order>> GetOrdersByUserIdAsync(string userId);
    Task<Order?> GetUnCompletedOrdersByUserIdAsync(string userId);
    Task<Order> CreateOrderAsync(List<OrderItem> items, string userId, string shippingAddressId, string billingingAddressId, long shippingCost, long discount);
    Task<Order> UpdateOrderAsync(string orderId, List<OrderItem> items, string shippingAddressId, string billingingAddressId, long shippingcost, long discount, string orderStatus, string paymentMethod, string paymentStatus);
    void AttachProduct(Product product);
}
