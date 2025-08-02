using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Banners;

public class DeleteBannerImageCommand : IRequest<AppResult<Unit>>
{
    public List<int> BannerImageIds { get; set; } = [];
}
