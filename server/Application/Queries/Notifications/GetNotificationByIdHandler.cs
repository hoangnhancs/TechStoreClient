using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Notifications;

public class GetNotificationByIdHandler : IRequestHandler<GetNotificationByIdQuery, Result<NotificationDto>>
{
    private readonly IMapper _mapper;
    private readonly INotificationRepository _notificationRepository;
    public GetNotificationByIdHandler(IMapper mapper, INotificationRepository notificationRepository)
    {
        _mapper = mapper;
        _notificationRepository = notificationRepository;
    }
    public async Task<Result<NotificationDto>> Handle(GetNotificationByIdQuery request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepository.GetNotificationById(request.Id, cancellationToken);
        if (notification == null) return Result<NotificationDto>.Failure("Notification not found", 404);
        return Result<NotificationDto>.Success(_mapper.Map<NotificationDto>(notification));
    }
}
