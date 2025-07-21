using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Banner;

public class GetAllBannerImagesQuery : IRequest<Result<List<BannerImageDto>>>
{

}
