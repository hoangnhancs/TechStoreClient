using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Products;

public class GetTop10ProductPerCategoryQuery : IRequest<AppResult<List<ProductDto>>>
{

}
