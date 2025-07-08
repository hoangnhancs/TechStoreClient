using System;
using Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interface;

public interface IPhotoService
{
    Task<PhotoUploadResultDto?> UploadPhoto(IFormFile file);
    Task<string> DeletePhoto(string publicId);
}
