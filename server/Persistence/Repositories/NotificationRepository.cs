using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class NotificationRepository(StoreContext context) : INotificationRepository
{
    private readonly StoreContext _context = context;
    public async Task<Notification> CreateNotification(Notification notification, CancellationToken cancellationToken)
    {
        await _context.Notifications.AddAsync(notification, cancellationToken);
        return notification;
    }

    public async Task<Notification> GetNotificationById(string id, CancellationToken cancellationToken)
    {
        return await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id, cancellationToken) ?? throw new Exception("Notification not found");
    }

    public async Task<List<Notification>> GetNotificationsByGroupId(string groupId, CancellationToken cancellationToken)
    {
        return await _context.Notifications.Where(n => n.GroupId == groupId).ToListAsync(cancellationToken);
    }

    public async Task<List<Notification>> GetNotificationsByUserId(string userId, CancellationToken cancellationToken)
    {
        return await _context.Notifications.Where(n => n.ReceiverId == userId).ToListAsync(cancellationToken);
    }
}
