using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly StoreContext _storeContext;
    public RefreshTokenRepository(StoreContext storeContext)
    {
        _storeContext = storeContext;
    }
    public async Task AddAsync(RefreshToken refreshToken)
    {
        await _storeContext.RefreshTokens.AddAsync(refreshToken);
        
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await _storeContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task RevokeAsync(string token, string revokeByIp, string? reason = null)
    {
        var refreshToken = await _storeContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token);
        if (refreshToken != null)
        {
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = revokeByIp;
            refreshToken.ReasonRevoked = reason;
        }
    }
}
