using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationsByGroupIdQuery : IRequest<AppResult<List<NotificationDto>>>
{
    public required string GroupId { get; set; }
}
