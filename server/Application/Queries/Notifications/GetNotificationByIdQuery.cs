using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationByIdQuery : IRequest<Result<NotificationDto>>
{
    public required string Id { get; set; }
}
