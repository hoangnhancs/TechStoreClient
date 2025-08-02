using System;
using System.Collections.Generic;
using Application.Core;
using Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Commands.Products;

public class CreateNewProductCommand : IRequest<AppResult<ProductDto>>
{
    public required ProductDto ProductDto { get; set; }
    public Dictionary<int, string> FilterTags { get; set; } = [];
    public List<ProductAttributeGroupDto> AttributeGroups { get; set; } = [];
    public IFormFile MainImageFile { get; set; } = null!;
    public List<IFormFile> DetailImageFiles { get; set; } = [];
}
public class ProductAttributeDto
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
}

public class ProductAttributeGroupDto
{
    public string GroupName { get; set; } = null!;
    public List<ProductAttributeDto> Attributes { get; set; } = new();
}
