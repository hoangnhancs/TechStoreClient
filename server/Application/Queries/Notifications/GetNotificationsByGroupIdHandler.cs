using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationsByGroupIdHandler : IRequestHandler<GetNotificationsByGroupIdQuery, AppResult<List<NotificationDto>>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;
    public GetNotificationsByGroupIdHandler(INotificationRepository notificationRepository, IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<NotificationDto>>> Handle(GetNotificationsByGroupIdQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetNotificationsByGroupId(request.GroupId, cancellationToken);
        // var notificationsDto = notifications.Select(_mapper.Map<NotificationDto>).ToList();
        var notificationsDto = _mapper.Map<List<NotificationDto>>(notifications);
        return AppResult<List<NotificationDto>>.Success(notificationsDto);
    }
}
