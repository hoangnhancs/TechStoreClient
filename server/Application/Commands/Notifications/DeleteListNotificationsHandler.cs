using System;
using Application.Core;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Notifications;

public class DeleteListNotificationsHandler : IRequestHandler<DeleteListNotificationsCommand, AppResult<Unit>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUnitOfWork _unitOfWork;
    public DeleteListNotificationsHandler(INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<Unit>> Handle(DeleteListNotificationsCommand request, CancellationToken cancellationToken)
    {
        foreach (var notiId in request.NotificationIds)
        {
            await _notificationRepository.DeleteNotification(notiId, cancellationToken);
        }
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result) return AppResult<Unit>.Failure("Problem when delete list notifications", 400);

        return AppResult<Unit>.Success(Unit.Value);  
    }
}
