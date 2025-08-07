using System;
using System.Security.Claims;
using Application.DTOs;
using Application.Queries.Products;
using MediatR;

namespace API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class ProductQuery
{
    public async Task<List<ProductDto>> GetSuggestionProducts([Service] IMediator _mediator, [Service] IHttpContextAccessor httpContextAccessor)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _mediator.Send(new GetSuggestionProductQuery{UserId = userId});
        if (!result.IsSuccess || result.Value == null) throw new Exception(result.Error);
        return result.Value;
    }
}
