using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class UserActionTrackingRepository(StoreContext context) : IUserActionTrackingRepository
{
    private readonly StoreContext _context = context;
    public async Task<UserActionTracking> AddUserActionTracking(UserActionTracking userActionTracking, CancellationToken cancellationToken)
    {
        await _context.UserActionTrackings.AddAsync(userActionTracking, cancellationToken);
        return userActionTracking;
    }

    public async Task<List<UserActionTracking>> GetUserActionTrackingByUserId(string userId, CancellationToken cancellationToken)
    {
        return await _context.UserActionTrackings
            .Where(uat => uat.UserId == userId)
            .OrderByDescending(uat => uat.ActionTime)
            .Take(100)
            .ToListAsync(cancellationToken);
    }
}
