using System;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Commands.Images;

public class UpdateUserImageCommand : IRequest<AppResult<object>>
{
    public required string UserId { get; set; }
    public required IFormFile NewImage { get; set; }
}
