using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IAccountRepository
{
    Task<User?> GetUserByIdAsync(string userId, CancellationToken cancellationToken);
}
