using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Notifications;

public class MarkAsReadNotificationHandler : IRequestHandler<MarkAsReadNotificationCommand, AppResult<NotificationDto>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    public MarkAsReadNotificationHandler(INotificationRepository notificationRepository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<NotificationDto>> Handle(MarkAsReadNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepository.MaskAsReadNotification(request.Id, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return AppResult<NotificationDto>.Success(_mapper.Map<NotificationDto>(notification));
    }
}
