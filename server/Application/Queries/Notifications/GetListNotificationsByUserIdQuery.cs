using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Notifications;

public class GetListNotificationsByUserIdQuery : IRequest<AppResult<List<NotificationDto>>>
{
    public required string UserId { get; set; }
}
