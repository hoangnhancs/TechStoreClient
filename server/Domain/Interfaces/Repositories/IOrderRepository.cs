using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order?> GetOrderByBasketIdAsync(string basketId);
    Task<Order> CreateOrderAsync(Basket basket, string userId, string adressId);
}
