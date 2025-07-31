using System;

namespace Domain.Entities;

public class Notification
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public required string Message { get; set; }
    public string? Link { get; set; }
    public bool IsRead { get; set; } = false;
    public string? ReceiverId { get; set; }
    public User? Receiver { get; set; }
    public string? GroupId { get; set; }
    public NotificationGroup? Group { get; set; }
    public required string SenderId { get; set; }
    public User? Sender { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
