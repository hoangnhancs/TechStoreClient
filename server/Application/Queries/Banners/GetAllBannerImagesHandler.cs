using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Banners;

public class GetAllBannerImagesHandler : IRequestHandler<GetAllBannerImagesQuery, AppResult<List<BannerImageDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllBannerImagesHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AppResult<List<BannerImageDto>>> Handle(GetAllBannerImagesQuery request, CancellationToken cancellationToken)
    {
        var bannerImages = await _unitOfWork.Banners.GetAllAsync(cancellationToken);
        var bannerImagesDto = bannerImages.Select(_mapper.Map<BannerImageDto>).ToList();
        return AppResult<List<BannerImageDto>>.Success(bannerImagesDto);
    }
}
