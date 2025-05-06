using System;

namespace Domain.Entities;

public class Basket
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string UserId { get; set; }
    public User? User { get; set; }
    public List<BasketItem> Items { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public void AddItem(Product product, int quantity)
    {
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than 0.", nameof(quantity));

        var existingItem = FindItem(product.Id);
        if (existingItem != null) existingItem.Quantity += quantity;
        else
        {
            Items.Add(new BasketItem
            {   
                ProductId = product.Id,
                Product = product,
                Quantity = quantity,
                BasketId = Id,
                Basket = this
            });
        }
    }

    public void RemoveItem(string productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than 0.", nameof(quantity));

        var item = FindItem(productId);

        if (item == null) return;

        if (quantity >= item.Quantity)
        {
            Items.Remove(item);
        }
        else
        {
            item.Quantity -= quantity;
        }
    }

    private BasketItem? FindItem(string productId)
    {
        return Items.FirstOrDefault(x => x.ProductId == productId);
    }
    public void RemovePermanentItem(string productId)
    {
        var item = FindItem(productId);
        if (item != null) Items.Remove(item);
    } 
}
