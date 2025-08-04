using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Banners;

public class GetAllBannerImagesQuery : IRequest<AppResult<List<BannerImageDto>>>
{

}
