using System;
using Application.Core;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Notifications;

public class MarkAsReadListNotificationHandler : IRequestHandler<MarkAsReadListNotificationCommand, AppResult<Unit>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;
    public MarkAsReadListNotificationHandler(INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<Unit>> Handle(MarkAsReadListNotificationCommand request, CancellationToken cancellationToken)
    {
        foreach (var notiId in request.NotificationIds)
        {
            await _notificationRepository.MaskAsReadNotification(notiId, cancellationToken);
        } 
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return AppResult<Unit>.Failure("Problem when mask as read all notification", 400);
        return AppResult<Unit>.Success(Unit.Value);
    }
}
