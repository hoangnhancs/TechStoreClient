using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FilterTags;

public class GetAllFilterTagQuery : IRequest<Result<List<FilterTagDto>>>
{

}

