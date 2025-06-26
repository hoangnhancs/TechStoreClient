using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FilterTag;

public class GetListFilterTagByCategoryHandler : IRequestHandler<GetListFilterTagByCategoryQuery, Result<List<FilterTagDto>>>
{
    private readonly IFilterTagRepository _filterTagRepository;
    private readonly IMapper _mapper;
    public GetListFilterTagByCategoryHandler(IMapper mapper, IFilterTagRepository filterTagRepository)
    {
        _filterTagRepository = filterTagRepository;
        _mapper = mapper;
    }
    public async Task<Result<List<FilterTagDto>>> Handle(GetListFilterTagByCategoryQuery request, CancellationToken cancellationToken)
    {
        var filterTags = await _filterTagRepository.GetListFilterTagByCategoryId(request.CategoryId, cancellationToken);
        if (filterTags == null || filterTags.Count == 0)
        {
            return Result<List<FilterTagDto>>.Failure("No filter tag values found for the specified category.", 404);
        }
        var filterTagsDto = filterTags.Select(_mapper.Map<FilterTagDto>).ToList();
        return Result<List<FilterTagDto>>.Success(filterTagsDto);
    }
}
