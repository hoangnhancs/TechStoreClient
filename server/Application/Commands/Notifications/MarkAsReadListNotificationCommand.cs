using System;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore.Query;

namespace Application.Commands.Notifications;

public class MarkAsReadListNotificationCommand : IRequest<AppResult<Unit>>
{
    public List<string> NotificationIds { get; set; } = [];
}
