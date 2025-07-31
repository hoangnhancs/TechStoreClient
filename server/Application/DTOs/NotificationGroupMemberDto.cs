using System;

namespace Application.DTOs;

public class NotificationGroupMemberDto
{
    public string Id { get; set; } = string.Empty;
    public string NotificationGroupId { get; set; } = string.Empty;
    public required string UserId { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; }
}
