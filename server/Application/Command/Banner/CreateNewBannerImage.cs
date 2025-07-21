using System;
using Application.Core;
using Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Command.Banner;

public class CreateNewBannerImageCommand : IRequest<Result<List<BannerImageDto>>>
{
    public required List<IFormFile> NewImages { get; set; }

}
