using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Products;

public class GetProductDetailsQuery : IRequest<AppResult<ProductDto>>
{
    public required string ProductId { get; set; } 
}
