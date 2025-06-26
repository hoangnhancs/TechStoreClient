using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FilterTagValue;

public class GetListFilterTagValueByCategoryHandler : IRequestHandler<GetListFilterTagValueByCategoryQuery, Result<List<FilterTagValueDto>>>
{
    private readonly IFilterTagValueRepository _filterTagValueRepository;
    private readonly IMapper _mapper;
    public GetListFilterTagValueByCategoryHandler(IMapper mapper, IFilterTagValueRepository filterTagValueRepository)
    {
        _filterTagValueRepository = filterTagValueRepository;
        _mapper = mapper;
    }
    public async Task<Result<List<FilterTagValueDto>>> Handle(GetListFilterTagValueByCategoryQuery request, CancellationToken cancellationToken)
    {
        var filterTagValues = await _filterTagValueRepository.GetListFilterTagValueByCategoryId(request.CategoryId, cancellationToken);
        if (filterTagValues == null || filterTagValues.Count == 0)
        {
            return Result<List<FilterTagValueDto>>.Failure("No filter tag values found for the specified category.", 404);
        }
        var filterTagValuesDto = filterTagValues.Select(_mapper.Map<FilterTagValueDto>).ToList();
        return Result<List<FilterTagValueDto>>.Success(filterTagValuesDto);
    }
}
