using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Banners;

public class GetAllBannerImagesQuery : IRequest<Result<List<BannerImageDto>>>
{

}
