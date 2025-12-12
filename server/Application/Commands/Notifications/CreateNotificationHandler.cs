using System;
using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.Data.SqlClient;


namespace Application.Commands.Notifications;

public class CreateNotificationHandler : IRequestHandler<CreateNotificationCommand, AppResult<NotificationDto>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAccountRepository _accountRepository;

    public CreateNotificationHandler(INotificationRepository notificationRepository, IMapper mapper, IUnitOfWork unitOfWork, IAccountRepository accountRepository)
    {
        _notificationRepository = notificationRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _accountRepository = accountRepository;
    }
    public async Task<AppResult<NotificationDto>> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        var newLink = !String.IsNullOrEmpty(request.CommentResultId)
            ? request.NotificationDto.Link + "?commentId=" + request.CommentResultId
                : !String.IsNullOrEmpty(request.ReviewResultId)
                    ? request.NotificationDto.Link + "?reviewId=" + request.ReviewResultId
                        : request.NotificationDto.Link;
        var notification = new Notification()
        {
            Title = request.NotificationDto.Title ?? string.Empty,
            Message = request.NotificationDto.Message ?? string.Empty,
            Link = newLink ?? "/",
            ReceiverId = request.NotificationDto.ReceiverId,
            GroupId = request.NotificationDto.GroupId,
            SenderId = request.NotificationDto.SenderId ?? string.Empty,
            Sender = await _accountRepository.GetUserByIdAsync(request.NotificationDto.SenderId ?? string.Empty, cancellationToken) ?? throw new Exception(),
            Type = Enum.Parse<Domain.Entities.Notification.NotificationType>(request.NotificationDto.Type ?? string.Empty),
        };

        await _notificationRepository.CreateNotification(notification, cancellationToken);
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result) return AppResult<NotificationDto>.Failure("Problem when create notification", 400);
        return AppResult<NotificationDto>.Success(_mapper.Map<NotificationDto>(notification));
    }
}
