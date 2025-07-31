using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.NotificationGroup;

public class GetNotificationGroupsByUserIdQuery : IRequest<Result<List<NotificationGroupDto>>>
{
    public required string UserId { get; set; }
}
