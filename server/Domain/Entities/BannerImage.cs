using System;

namespace Domain.Entities;

public class BannerImage
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? Title { get; set; }
    public required string PublicId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
