using System;
using System.Text.Json.Serialization;

namespace Domain.Entities;

public class UserImage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Url { get; set; }
    public required string PublicId { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; } 
}
