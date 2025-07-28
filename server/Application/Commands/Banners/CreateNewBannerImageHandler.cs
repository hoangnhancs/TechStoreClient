using System;
using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Banners;

public class CreateNewBannerImageHandler : IRequestHandler<CreateNewBannerImageCommand, Result<List<BannerImageDto>>>
{
    private readonly IBannerRepository _bannerRepository;
    private readonly IPhotoService _photoService;
    private readonly IMapper _mapper;
    private IUnitOfWork _unitOfWork;
    public CreateNewBannerImageHandler(IBannerRepository bannerRepository, IMapper mapper, IUnitOfWork unitOfWork, IPhotoService photoService)
    {
        _bannerRepository = bannerRepository;
        _photoService = photoService;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<List<BannerImageDto>>> Handle(CreateNewBannerImageCommand request, CancellationToken cancellationToken)
    {
        var bannerImagesDto = new List<BannerImageDto>();
        foreach (var image in request.NewImages)
        {
            var uploadResult = await _photoService.UploadPhoto(image);
            if (uploadResult == null) return Result<List<BannerImageDto>>.Failure($"Image {image.Name} upload failed", 502);
            var bannerImage = new BannerImage
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.Url
            };
            await _bannerRepository.AddNewBannerImage(bannerImage, cancellationToken);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result) return Result<List<BannerImageDto>>.Failure($"Problem when create banner image {image.Name}", 400);
            bannerImagesDto.Add(_mapper.Map<BannerImageDto>(bannerImage));
        }
        
        return Result<List<BannerImageDto>>.Success(bannerImagesDto);
    }
}
