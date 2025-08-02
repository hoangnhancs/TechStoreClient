using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Notifications;

public class CreateNotificationCommand : IRequest<AppResult<NotificationDto>>
{
    public string? CommentResultId { get; set; }
    public string? ReviewResultId { get; set; }
    public required NotificationDto NotificationDto { get; set; }
}
