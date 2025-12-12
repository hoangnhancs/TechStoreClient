using System;

namespace Application.Interface;

public interface IRedisService
{
    Task<string?> GetStringAsync(string key);
    Task SetStringAsync(string key, string value, TimeSpan? expiry = null);
    Task<bool> LockTakeAsync(string key, string value, TimeSpan expiry);
    Task<bool> LockReleaseAsync(string key, string value);
}
