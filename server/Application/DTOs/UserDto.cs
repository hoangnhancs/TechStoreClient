using System;

namespace Application.DTOs;

public class UserDto
{
    public required string Id { get; set; } 
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public long TotalSpent { get; set; }
    public List<string> Roles { get; set; } = [];

}
