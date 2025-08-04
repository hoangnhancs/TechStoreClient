using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetAllFilterTagQuery : IRequest<AppResult<List<FilterTagDto>>>
{

}

