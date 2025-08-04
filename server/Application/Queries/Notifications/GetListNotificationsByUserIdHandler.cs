using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetListNotificationsByUserIdHandler : IRequestHandler<GetListNotificationsByUserIdQuery, AppResult<List<NotificationDto>>>
{
    private readonly IMapper _mapper;
    private readonly INotificationRepository _notificationRepository;

    public GetListNotificationsByUserIdHandler(IMapper mapper, INotificationRepository notificationRepository)
    {
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }

    public async Task<AppResult<List<NotificationDto>>> Handle(GetListNotificationsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetNotificationsByUserId(request.UserId, cancellationToken);
        var notificationsDto = notifications.Select(_mapper.Map<NotificationDto>).ToList();
        return AppResult<List<NotificationDto>>.Success(notificationsDto);
    }
}
