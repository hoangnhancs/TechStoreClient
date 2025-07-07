using System;

namespace Application.DTOs;

public class AccessTokenResult
{
    public required string Token { get; set; }
    public DateTime Expires { get; set; }
}
