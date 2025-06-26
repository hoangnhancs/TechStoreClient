using System;
using Application.DTOs;

namespace API.DTOs;

public class CreateCommentDto
{
    public required string Content { get; set; }
    public string? ParentCommentId { get; set; } = null;
    public required string ProductId { get; set; } = string.Empty;
}
