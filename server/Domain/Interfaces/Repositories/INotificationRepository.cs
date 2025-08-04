using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface INotificationRepository
{
    Task<Notification> CreateNotification(Notification notification, CancellationToken cancellationToken);
    Task<Notification> GetNotificationById(string id, CancellationToken cancellationToken);
    Task<List<Notification>> GetNotificationsByUserId(string userId, CancellationToken cancellationToken);
    Task<List<Notification>> GetNotificationsByGroupId(string groupId, CancellationToken cancellationToken);
    Task<Notification> MaskAsReadNotification(string notificationId, CancellationToken cancellationToken);
    Task DeleteNotification(string notificationId, CancellationToken cancellationToken);
}
