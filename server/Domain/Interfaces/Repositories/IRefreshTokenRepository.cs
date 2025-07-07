using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task AddAsync(RefreshToken refreshToken);
    Task RevokeAsync(string token, string revokeByIp, string? reason = null);
    Task RevokeAllAsync(string userId, string revokeByIp, string? reason = null);
}
