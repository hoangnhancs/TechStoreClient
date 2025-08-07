using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IUserActionTrackingRepository
{
    Task<UserActionTracking> AddUserActionTracking(UserActionTracking userActionTracking, CancellationToken cancellationToken);
    Task<List<UserActionTracking>> GetUserActionTrackingByUserId(string userId, CancellationToken cancellationToken);
}
