using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class BannerRepository(StoreContext context) : BaseRepository<BannerImage>(context), IBannerRepository
{
    // private readonly StoreContext _context = context;

    // public async Task<BannerImage> AddNewBannerImage(BannerImage bannerImage, CancellationToken cancellationToken)
    // {
    //     await _context.BannerImages.AddAsync(bannerImage);
    //     return bannerImage;
    // }

    // public async Task DeleteBannerImage(int bannerImageId, CancellationToken cancellationToken)
    // {
    //     var bannerImage = await _context.BannerImages.FindAsync(bannerImageId);
    //     if (bannerImage == null) throw new Exception("Banner image not found");
    //     _context.BannerImages.Remove(bannerImage);
    // }

    // public async Task<List<BannerImage>> GetAllBannerImages()
    // {
    //     return await _context.BannerImages.ToListAsync();
    // }

    // public async Task<BannerImage?> GetBannerImageById(int bannerImageId, CancellationToken cancellationToken)
    // {
    //     return await _context.BannerImages.FirstOrDefaultAsync(bi => bi.Id == bannerImageId, cancellationToken);
    // }
}
