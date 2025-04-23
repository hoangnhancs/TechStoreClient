using System;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Persistence.Repositories;

public class AccountRepository(StoreContext context) : IAccountRepository
{
    private readonly StoreContext _context = context;
    public async Task<User?> GetUserByIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Users

            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken) as User;
    }
}
