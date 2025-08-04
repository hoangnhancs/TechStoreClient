using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class NotificationGroupRepository(StoreContext context) : INotificationGroupRepository
{
    private readonly StoreContext _context = context;
    public async Task<List<NotificationGroup>> GetNotificationGroupByUserId(string userId)
    {
        return await _context.NotificationGroups.Where(ng => ng.Members.Any(m => m.UserId == userId)).ToListAsync();
    }

    public async Task<NotificationGroup?> GetAdminNotificationGroup(CancellationToken cancellationToken)
    {
        return await _context.NotificationGroups.FirstOrDefaultAsync(ng => ng.Name == "admin-notifications", cancellationToken);
    }

    
}
