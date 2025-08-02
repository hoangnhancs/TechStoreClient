using System;

namespace Application.DTOs;

public class NotificationDto
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Message { get; set; }
    public string? Link { get; set; }
    public bool IsRead { get; set; } = false;
    public string? ReceiverId { get; set; }
    public string? GroupId { get; set; }
    public string? SenderId { get; set; }
    public string? SenderName { get; set; }
    public string? SenderImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
