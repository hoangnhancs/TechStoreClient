using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetListFilterTagByCategoryHandler : IRequestHandler<GetListFilterTagByCategoryQuery, AppResult<List<FilterTagDto>>>
{
    private readonly IFilterTagRepository _filterTagRepository;
    private readonly IMapper _mapper;
    public GetListFilterTagByCategoryHandler(IMapper mapper, IFilterTagRepository filterTagRepository)
    {
        _filterTagRepository = filterTagRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<FilterTagDto>>> Handle(GetListFilterTagByCategoryQuery request, CancellationToken cancellationToken)
    {
        var filterTags = await _filterTagRepository.GetListFilterTagByCategoryId(request.CategoryId, cancellationToken);
        if (filterTags == null || filterTags.Count == 0)
        {
            return AppResult<List<FilterTagDto>>.Failure("No filter tag values found for the specified category.", 404);
        }
        var filterTagsDto = filterTags.Select(_mapper.Map<FilterTagDto>).ToList();
        return AppResult<List<FilterTagDto>>.Success(filterTagsDto);
    }
}
