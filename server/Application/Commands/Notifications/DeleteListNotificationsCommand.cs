using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Notifications;

public class DeleteListNotificationsCommand : IRequest<AppResult<Unit>>
{
    public List<string> NotificationIds { get; set; } = [];
}
