using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Products;

public class GetProductListByCategoryQuery : IRequest<AppResult<List<ProductDto>>>
{
    public int CategoryId { get; set; }
}

