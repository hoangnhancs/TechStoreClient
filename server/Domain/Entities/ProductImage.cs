using System;

namespace Domain.Entities;

public class ProductImage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ImageUrl { get; set; } = string.Empty;
    // chỉ dùng khi ảnh lưu trên Cloudinary
    //khi khởi tạo thì không có PublicId
    public string? PublicId { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; } 
}
