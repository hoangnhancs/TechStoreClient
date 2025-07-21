using System;

namespace Application.DTOs;

public class BannerImageDto
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public required string PublicId { get; set; } 
    public DateTime CreatedAt { get; set; }
}
