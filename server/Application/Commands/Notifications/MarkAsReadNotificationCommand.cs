using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Notifications;

public class MarkAsReadNotificationCommand : IRequest<AppResult<NotificationDto>>
{
    public required string Id { get; set; }
}
