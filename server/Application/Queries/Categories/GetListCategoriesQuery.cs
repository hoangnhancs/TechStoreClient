using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Categories;

public class GetListCategoriesQuery : IRequest<AppResult<List<CategoryDto>>>
{
    
}
