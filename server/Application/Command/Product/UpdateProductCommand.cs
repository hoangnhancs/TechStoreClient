using System;
using Application.Core;
using Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Application.Command.Product;

public class UpdateProductCommand : IRequest<Result<ProductDto>>
{
    public required ProductDto ProductDto { get; set; }
    public Dictionary<int, string> FilterTags { get; set; } = [];
    public List<ProductAttributeGroupDto> AttributeGroups { get; set; } = [];
    public SingleImageInput MainImageInput { get; set; } = null!;
    public ListImageInput? DetailImageInputs { get; set; }
}

public class SingleImageInput
{
    public IFormFile? File { get; set; }
    public string? Url { get; set; }
}

public class ListImageInput
{
    public List<IFormFile> Files { get; set; } = [];
    public List<string> Urls { get; set; } = [];
}


