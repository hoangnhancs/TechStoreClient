using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationsByGroupIdQuery : IRequest<Result<List<NotificationDto>>>
{
    public required string GroupId { get; set; }
}
