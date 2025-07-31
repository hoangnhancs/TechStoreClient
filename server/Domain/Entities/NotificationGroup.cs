using System;

namespace Domain.Entities;

public class NotificationGroup
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public List<NotificationGroupMember> Members { get; set; } = [];
}
