using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetListNotificationsByListIdsHandler : IRequestHandler<GetListNotificationsByListIdsQuery, AppResult<List<NotificationDto>>>
{
    private readonly IMapper _mapper;
    private readonly INotificationRepository _notificationRepository;
    public GetListNotificationsByListIdsHandler(INotificationRepository notificationRepository, IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<NotificationDto>>> Handle(GetListNotificationsByListIdsQuery request, CancellationToken cancellationToken)
    {
        var listNotis = new List<Notification>();
        foreach (var id in request.NotificationIds)
        {
            var noti = await _notificationRepository.GetNotificationById(id, cancellationToken);
            if (noti != null) listNotis.Add(noti);
        }
        var listNotisDto = listNotis.Select(_mapper.Map<NotificationDto>).ToList();
        return AppResult<List<NotificationDto>>.Success(listNotisDto);
    }
}
