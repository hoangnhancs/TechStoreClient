using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetAllFilterTagHandler : IRequestHandler<GetAllFilterTagQuery, AppResult<List<FilterTagDto>>>
{
    private readonly IFilterTagRepository _filterTagRepository;
    private readonly IMapper _mapper;
    public GetAllFilterTagHandler(IFilterTagRepository filterTagRepository, IMapper mapper)
    {
        _filterTagRepository = filterTagRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<FilterTagDto>>> Handle(GetAllFilterTagQuery request, CancellationToken cancellationToken)
    {
        var filterTag = await _filterTagRepository.GetAllFilterTags(cancellationToken);
        if (filterTag == null || filterTag.Count == 0)
        {
            return AppResult<List<FilterTagDto>>.Failure("No filter tags found.", 404);
        }
        var filterTagDtos = _mapper.Map<List<FilterTagDto>>(filterTag);
        return AppResult<List<FilterTagDto>>.Success(filterTagDtos);
    }
}
