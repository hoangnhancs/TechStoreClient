using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Products;

public class GetSuggestionProductQuery : IRequest<AppResult<List<ProductDto>>>
{
    public string? UserId { get; set; }
}
