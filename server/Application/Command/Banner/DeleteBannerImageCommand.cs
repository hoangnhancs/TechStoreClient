using System;
using Application.Core;
using MediatR;

namespace Application.Command.Banner;

public class DeleteBannerImageCommand : IRequest<Result<Unit>>
{
    public List<int> BannerImageIds { get; set; } = [];
}
