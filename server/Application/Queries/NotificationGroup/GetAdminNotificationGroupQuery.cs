using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.NotificationGroup;

public class GetAdminNotificationGroupQuery : IRequest<AppResult<NotificationGroupDto>>
{

}
