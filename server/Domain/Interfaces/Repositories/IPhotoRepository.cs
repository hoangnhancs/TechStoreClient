using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IPhotoRepository
{
    Task<UserImage?> GetImageByUserIdAsync(string userId);
    Task<string> UpdateImage(string userId, string newImageUrl, string publicId);
}
