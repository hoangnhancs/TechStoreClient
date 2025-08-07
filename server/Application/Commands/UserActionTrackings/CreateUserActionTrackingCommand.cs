using System;
using Application.Core;
using MediatR;

namespace Application.Commands.UserActionTrackings;

public class CreateUserActionTrackingCommand : IRequest<AppResult<int>>
{
    public required string UserId { get; set; }
    public required string ProductId { get; set; }
    public required string ActionType { get; set; }
}
