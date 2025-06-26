using System;

namespace Domain.Entities;

public class Comment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Content { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public bool IsVisible { get; set; } = true;
    public bool IsEdited { get; set; } = false;
    public required string UserId { get; set; }
    public User? User { get; set; }
    public required string ProductId { get; set; }
    public Product? Product { get; set; }
    public string? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }
    public List<Comment> Replies { get; set; } = [];
    public bool IsAdminComment { get; set; } = false;
    public bool HasAdminReply { get; set; } = false;
    public bool CanReply(string userId, bool isAdmin)
    {
        return UserId == userId || isAdmin;
    }
}
