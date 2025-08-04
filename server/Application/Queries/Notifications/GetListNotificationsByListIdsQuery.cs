using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Notifications;

public class GetListNotificationsByListIdsQuery : IRequest<AppResult<List<NotificationDto>>>
{
    public List<string> NotificationIds { get; set; } = [];
}
