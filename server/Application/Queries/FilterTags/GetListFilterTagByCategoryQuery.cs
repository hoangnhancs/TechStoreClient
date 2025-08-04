using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetListFilterTagByCategoryQuery : IRequest<AppResult<List<FilterTagDto>>>
{
    public required int CategoryId { get; set; }

}

