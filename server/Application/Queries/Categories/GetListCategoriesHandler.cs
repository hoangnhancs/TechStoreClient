using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Categories;

public class GetListCategoriesHandler : IRequestHandler<GetListCategoriesQuery, Result<List<CategoryDto>>>
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;
    public GetListCategoriesHandler(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<Result<List<CategoryDto>>> Handle(GetListCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetCategories();
        if (categories == null || categories.Count == 0)
        {
            return Result<List<CategoryDto>>.Failure("No categories found.", 404);
        }
        
        var categoryDtos = _mapper.Map<List<CategoryDto>>(categories);
        return Result<List<CategoryDto>>.Success(categoryDtos);
    }
}
