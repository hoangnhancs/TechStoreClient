using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Category;

public class GetListCategoriesQuery : IRequest<Result<List<CategoryDto>>>
{
    
}
