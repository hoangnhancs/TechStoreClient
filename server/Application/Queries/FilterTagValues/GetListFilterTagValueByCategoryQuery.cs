using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FilterTagValues;

public class GetListFilterTagValueByCategoryQuery : IRequest<AppResult<List<FilterTagValueDto>>>
{
    public required int CategoryId;
}
