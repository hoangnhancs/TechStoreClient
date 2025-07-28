using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Notifications;

public class CreateNotificationHandler : IRequestHandler<CreateNotificationCommand, Result<NotificationDto>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    public CreateNotificationHandler(INotificationRepository notificationRepository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<NotificationDto>> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = new Notification()
        {
            Tittle = request.NotificationDto.Tittle ?? string.Empty,
            Message = request.NotificationDto.Message ?? string.Empty,
            Link = request.NotificationDto.Link,
            ReceivedId = request.NotificationDto.ReceivedId ?? string.Empty,
        };
        await _notificationRepository.CreateNotification(notification, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return Result<NotificationDto>.Failure("Problem when create notification", 400);
        return Result<NotificationDto>.Success(_mapper.Map<NotificationDto>(notification));
    }
}
