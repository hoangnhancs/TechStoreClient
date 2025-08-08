using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class FlashSaleProductRepository(StoreContext context) : IFlashSaleProductRepository
{
    private readonly StoreContext _context = context;
    public async Task<FlashSaleProduct> CreateFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken)
    {
        await _context.FlashSaleProducts.AddAsync(flashSaleProduct, cancellationToken);
        return flashSaleProduct;
    }

    public async Task<List<FlashSaleProduct>> GetAvailableFlashSaleProducts(CancellationToken cancellationToken)
    {
        return await _context.FlashSaleProducts.Where(f => f.EndTime > DateTime.Now && f.IsDeleted && f.IsInProgress).ToListAsync(cancellationToken);
    }

    public Task<List<FlashSaleProduct>> GetAllFlashSaleProducts(CancellationToken cancellationToken)
    {
        return _context.FlashSaleProducts.Where(f => f.IsDeleted).ToListAsync(cancellationToken);
    }

    public async Task RemoveFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken)
    {
        var product = await _context.FlashSaleProducts.FirstOrDefaultAsync(p => p.ProductId == flashSaleProduct.ProductId, cancellationToken);
        if (product == null) return;
        product.IsDeleted = false;
    }

    public async Task<FlashSaleProduct> UpdateFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken)
    {
        var product = await _context.FlashSaleProducts.FirstOrDefaultAsync(p => p.ProductId == flashSaleProduct.ProductId, cancellationToken);
        if (product == null) throw new Exception("Product not found");
        product.FlashPrice = flashSaleProduct.FlashPrice;
        product.EndTime = flashSaleProduct.EndTime;
        product.StartTime = flashSaleProduct.StartTime;
        product.TotalQuantity = flashSaleProduct.TotalQuantity;
        product.RemainQuntity = flashSaleProduct.RemainQuntity;
        product.StartTime = flashSaleProduct.StartTime;
        product.EndTime = flashSaleProduct.EndTime;
        return product;
    }
}
