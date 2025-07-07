using System;

namespace Domain.Entities;

public class RefreshToken
{
    public int Id;
    public required string Token { get; set; }
    public string UserId { get; set; } = null!;
    public User? User { get; set; }
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime Expires { get; set; } = DateTime.Now.AddDays(7);
    public string? IpAddress { get; set; }
    public string? ReplacedByToken { get; set; }
    public DateTime? Revoked { get; set; }
    public string? RevokedByIp { get; set; }
    public string? ReasonRevoked { get; set; }
    public bool IsExpired => DateTime.UtcNow >= Expires;
    public bool IsActive => Revoked == null && !IsExpired;
}
