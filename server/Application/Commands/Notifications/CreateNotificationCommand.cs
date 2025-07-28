using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Notifications;

public class CreateNotificationCommand : IRequest<Result<NotificationDto>>
{
    public required NotificationDto NotificationDto { get; set; }
}
