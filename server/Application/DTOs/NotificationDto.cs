using System;

namespace Application.DTOs;

public class NotificationDto
{
    public string? Id { get; set; } 
    public string? Tittle { get; set; }
    public string? Message { get; set; }
    public string? Link { get; set; }
    public bool IsRead { get; set; } = false;
    public string? ReceivedId { get; set; }
}
