using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Domain.Entities;

public class ProductVectorEmbedding
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; }
    [NotMapped]
    public List<float> Embedding { get; set; } = new();

    // Property thực tế được lưu trong DB
    public string EmbeddingJson
    {
        get => JsonSerializer.Serialize(Embedding);
        set => Embedding = string.IsNullOrWhiteSpace(value)
            ? new List<float>()
            : JsonSerializer.Deserialize<List<float>>(value) ?? new List<float>();
    }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
