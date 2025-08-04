using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationByIdHandler : IRequestHandler<GetNotificationByIdQuery, AppResult<NotificationDto>>
{
    private readonly IMapper _mapper;
    private readonly INotificationRepository _notificationRepository;
    public GetNotificationByIdHandler(IMapper mapper, INotificationRepository notificationRepository)
    {
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }
    public async Task<AppResult<NotificationDto>> Handle(GetNotificationByIdQuery request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepository.GetNotificationById(request.Id, cancellationToken);
        if (notification == null) return AppResult<NotificationDto>.Failure("Notification not found", 404);
        return AppResult<NotificationDto>.Success(_mapper.Map<NotificationDto>(notification));
    }
}
