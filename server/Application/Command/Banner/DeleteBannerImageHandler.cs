using System;
using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Banner;

public class DeleteBannerImageHandler : IRequestHandler<DeleteBannerImageCommand, Result<Unit>>
{
    private readonly IBannerRepository _bannerRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhotoService _photoService;
    public DeleteBannerImageHandler(IBannerRepository bannerRepository, IMapper mapper, IUnitOfWork unitOfWork, IPhotoService photoService)
    {
        _bannerRepository = bannerRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _photoService = photoService;
    }
    public async Task<Result<Unit>> Handle(DeleteBannerImageCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.BannerImageIds)
        {
            var banner = await _bannerRepository.GetBannerImageById(id, cancellationToken);
            if (banner == null) return Result<Unit>.Failure($"Banner image with ID: {id} not found.", 404);
            await _bannerRepository.DeleteBannerImage(id, cancellationToken);
            await _photoService.DeletePhoto(banner.PublicId);
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result) return Result<Unit>.Failure($"Problem when delete banner image with ID: {id}.", 400);
        }
        
        return Result<Unit>.Success(Unit.Value);
    }
}
