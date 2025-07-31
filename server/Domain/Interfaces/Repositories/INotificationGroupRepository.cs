using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface INotificationGroupRepository
{
    Task<List<NotificationGroup>> GetNotificationGroupByUserId(string userId);
}
