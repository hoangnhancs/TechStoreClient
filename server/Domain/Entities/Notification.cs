using System;

namespace Domain.Entities;

public class Notification
{
    public string Id { get; set; } = new Guid().ToString();
    public required string Tittle { get; set; }
    public required string Message { get; set; }
    public string? Link { get; set; }
    public bool IsRead { get; set; } = false;
    public required string ReceivedId { get; set; }
    public User? Receiver { get; set; }
}
