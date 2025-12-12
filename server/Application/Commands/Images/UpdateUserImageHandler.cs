using System;
using Application.Core;
using Application.Interface;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Images;

public class UpdateUserImageHandler : IRequestHandler<UpdateUserImageCommand, AppResult<object>>
{
    private readonly IPhotoRepository _photoRepository;
    private readonly IPhotoService _photoService;
    private IUnitOfWork _unitOfWork;
    public UpdateUserImageHandler(IPhotoRepository photoRepository, IPhotoService photoService, IUnitOfWork unitOfWork)
    {
        _photoRepository = photoRepository ;
        _photoService = photoService;
        _unitOfWork = unitOfWork ;
    }
    public async Task<AppResult<object>> Handle(UpdateUserImageCommand request, CancellationToken cancellationToken)
    {
        var image = await _photoRepository.GetImageByUserIdAsync(request.UserId);
        
        var uploadResult = await _photoService.UploadPhoto(request.NewImage);
        if (uploadResult == null)
        {
            return AppResult<object>.Failure("Image upload failed", 502);
        }
        if (image != null)
        {
            await _photoService.DeletePhoto(image.PublicId); //neu user da co anh cu, thi xoa anh cu tren cloudinary
        }     
        await _photoRepository.UpdateImage(request.UserId, uploadResult.Url, uploadResult.PublicId); //update anh moi vao DB
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result)
        {
            return AppResult<object>.Failure("Failed to save image into DB", 400);
        }
        return AppResult<object>.Success(new { imageUrl = uploadResult.Url });
    }
}
