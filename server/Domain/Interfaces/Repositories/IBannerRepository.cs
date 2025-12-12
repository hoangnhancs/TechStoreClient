using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IBannerRepository : IBaseRepository<BannerImage>
{
    // Task<BannerImage> AddNewBannerImage(BannerImage bannerImage, CancellationToken cancellationToken);
    // Task DeleteBannerImage(int bannerImageId, CancellationToken cancellationToken);
    // Task<List<BannerImage>> GetAllBannerImages();
    // Task<BannerImage?> GetBannerImageById(int bannerImageId, CancellationToken cancellationToken);
}
