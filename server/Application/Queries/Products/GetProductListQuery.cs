using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Products;

public class GetProductListQuery : IRequest<AppResult<List<ProductDto>>>
{

}

