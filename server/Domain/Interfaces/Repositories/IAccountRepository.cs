using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IAccountRepository : IBaseRepository<User>
{
    Task<User?> GetUserByIdAsync(string userId, CancellationToken cancellationToken);
}
