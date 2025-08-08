using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IFlashSaleProductRepository
{
    Task<FlashSaleProduct> CreateFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken);
    Task RemoveFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken);
    Task<FlashSaleProduct> UpdateFlashSaleProduct(FlashSaleProduct flashSaleProduct, CancellationToken cancellationToken);
    Task<List<FlashSaleProduct>> GetAllFlashSaleProducts(CancellationToken cancellationToken);
    Task<List<FlashSaleProduct>> GetAvailableFlashSaleProducts(CancellationToken cancellationToken);
}
