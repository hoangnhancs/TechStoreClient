using System;

namespace Application.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public required string ProductId { get; set; } = string.Empty;
    public required string UserId { get; set; } = string.Empty;
    public UserDto? User { get; set; }
    public required int Rating { get; set; }
    public string? Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
