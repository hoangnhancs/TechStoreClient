using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class PhotoRepository : IPhotoRepository
{
    private readonly StoreContext _context;
    public PhotoRepository(StoreContext context)
    {
        _context = context;
    }

    public async Task<UserImage?> GetImageByUserIdAsync(string userId)
    {
        return await _context.UserImages
            .FirstOrDefaultAsync(i => i.UserId == userId);
    }

    public async Task<string> UpdateImage(string userId, string newImageUrl, string publicId)
    {
        var oldImage = await _context.UserImages
            .FirstOrDefaultAsync(i => i.UserId == userId);
        if (oldImage == null)
        {
            _context.UserImages.Add(new UserImage { UserId = userId, Url = newImageUrl, PublicId = publicId });
        }
        else
        {
            oldImage.Url = newImageUrl;
        }
        
        return newImageUrl;
    }
}
