using System;
using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Banners;

public class DeleteBannerImageHandler : IRequestHandler<DeleteBannerImageCommand, AppResult<Unit>>
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhotoService _photoService;
    public DeleteBannerImageHandler(IMapper mapper, IUnitOfWork unitOfWork, IPhotoService photoService)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _photoService = photoService;
    }
    public async Task<AppResult<Unit>> Handle(DeleteBannerImageCommand request, CancellationToken cancellationToken)
    {
        foreach (var id in request.BannerImageIds)
        {
            var banner = await _unitOfWork.Banners.GetByIdAsync(id, cancellationToken);
            if (banner == null) return AppResult<Unit>.Failure($"Banner image with ID: {id} not found.", 404);
            _unitOfWork.Banners.Delete(banner);
            await _photoService.DeletePhoto(banner.PublicId);
            var result = await _unitOfWork.CommitAsync(cancellationToken);
            if (!result) return AppResult<Unit>.Failure($"Problem when delete banner image with ID: {id}.", 400);
        }
        
        return AppResult<Unit>.Success(Unit.Value);
    }
}
