using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetListNotificationsByUserIdHandler : IRequestHandler<GetListNotificationsByUserIdQuery, Result<List<NotificationDto>>>
{
    private readonly IMapper _mapper;
    private readonly INotificationRepository _notificationRepository;

    public GetListNotificationsByUserIdHandler(IMapper mapper, INotificationRepository notificationRepository)
    {
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }

    public async Task<Result<List<NotificationDto>>> Handle(GetListNotificationsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetNotificationsByUserId(request.UserId, cancellationToken);
        var notificationsDto = notifications.Select(_mapper.Map<NotificationDto>).ToList();
        return Result<List<NotificationDto>>.Success(notificationsDto);
    }
}
