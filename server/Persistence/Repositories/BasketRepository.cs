using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class BasketRepository(StoreContext context) : IBasketRepository
{
    private readonly StoreContext _context = context;

    public async Task<Basket> AddItemToBasketAsync(string userId, Product product, int quantity, CancellationToken cancellationToken)
    {
        var basket = await GetBasketByUserIdAsync(userId, cancellationToken);

        if (basket == null)
        {
            basket = new Basket { UserId = userId };
            _context.Baskets.Add(basket);
        }

        basket.AddItem(product, quantity);
        basket.UpdatedAt = DateTime.UtcNow;
        return basket;
    }

    public Task CreateBasketAsync(string userId, CancellationToken cancellationToken)
    {
        var basket = new Basket { UserId = userId };
        _context.Baskets.Add(basket);
        return Task.CompletedTask;
    }

    public async Task<Basket?> GetBasketByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Baskets

            .Include(x => x.Items)
            .ThenInclude(x => x.Product)
            .ThenInclude(x => x!.Category)
            .FirstOrDefaultAsync(b => b.UserId == userId, cancellationToken);
    }

    public async Task<Basket> RemoveItemFromBasketAsync(string userId, string productId, int quantity, CancellationToken cancellationToken)
    {
        var basket = await GetBasketByUserIdAsync(userId, cancellationToken) ?? throw new InvalidOperationException("Basket not found");
        basket.RemoveItem(productId, quantity);
        basket.UpdatedAt = DateTime.UtcNow;
        return basket;
    }

    public async Task<Basket> RemovePermanentItemsFromBasketAsync(string userId, List<string> productIds, CancellationToken cancellationToken)
    {
        var basket = await GetBasketByUserIdAsync(userId, cancellationToken) ?? throw new InvalidOperationException("Basket not found");
        foreach (var productId in productIds)
        {
            basket.RemovePermanentItem(productId);
        }
        basket.UpdatedAt = DateTime.UtcNow;
        return basket;
    }
}
