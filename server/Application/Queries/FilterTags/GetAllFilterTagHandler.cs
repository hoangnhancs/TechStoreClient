using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetAllFilterTagHandler : IRequestHandler<GetAllFilterTagQuery, Result<List<FilterTagDto>>>
{
    private readonly IFilterTagRepository _filterTagRepository;
    private readonly IMapper _mapper;
    public GetAllFilterTagHandler(IFilterTagRepository filterTagRepository, IMapper mapper)
    {
        _filterTagRepository = filterTagRepository;
        _mapper = mapper;
    }
    public async Task<Result<List<FilterTagDto>>> Handle(GetAllFilterTagQuery request, CancellationToken cancellationToken)
    {
        var filterTag = await _filterTagRepository.GetAllFilterTags(cancellationToken);
        if (filterTag == null || filterTag.Count == 0)
        {
            return Result<List<FilterTagDto>>.Failure("No filter tags found.", 404);
        }
        var filterTagDtos = _mapper.Map<List<FilterTagDto>>(filterTag);
        return Result<List<FilterTagDto>>.Success(filterTagDtos);
    }
}
