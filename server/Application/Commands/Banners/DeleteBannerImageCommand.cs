using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Banners;

public class DeleteBannerImageCommand : IRequest<Result<Unit>>
{
    public List<int> BannerImageIds { get; set; } = [];
}
