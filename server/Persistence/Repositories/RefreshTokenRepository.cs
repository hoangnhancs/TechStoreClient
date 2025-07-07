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

    public async Task RevokeAllAsync(string userId, string revokeByIp, string? reason = null)
    {
        var refreshTokens = await _storeContext.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.Revoked.HasValue && rt.Expires > DateTime.UtcNow) //token het han k can revoke
            .ToListAsync();
        
        foreach (var refreshToken in refreshTokens)
        {
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = revokeByIp;
            refreshToken.ReasonRevoked = reason;
        }
        /*
        // Cách tối ưu hơn với EF Core 7+, update luôn
        await _storeContext.RefreshTokens
            .Where(rt => rt.UserId == userId && !rt.Revoked.HasValue && rt.IsExpired == false)
            .ExecuteUpdateAsync(s => s
                .SetProperty(t => t.Revoked, DateTime.UtcNow)
                .SetProperty(t => t.RevokedByIp, revokeByIp)
                .SetProperty(t => t.ReasonRevoked, reason));
        */
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
