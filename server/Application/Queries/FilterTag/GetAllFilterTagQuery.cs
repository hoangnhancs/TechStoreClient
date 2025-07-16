using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FilterTag;

public class GetAllFilterTagQuery : IRequest<Result<List<FilterTagDto>>>
{
    
}   

