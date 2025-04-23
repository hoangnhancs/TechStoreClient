using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class ProductMapper
{
    public static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            Brand = product.Brand,
            QuantityInStock = product.QuantityInStock,
            ImageUrl = product.ImageUrl,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }

    public static Product MapToDomain(ProductDto productDto)
    {
        return new Product
        {
            Id = productDto.Id,
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Category = productDto.Category,
            Brand = productDto.Brand,
            QuantityInStock = productDto.QuantityInStock,
            ImageUrl = productDto.ImageUrl,
            CreatedAt = productDto.CreatedAt,
            UpdatedAt = productDto.UpdatedAt
        };
    }
}
