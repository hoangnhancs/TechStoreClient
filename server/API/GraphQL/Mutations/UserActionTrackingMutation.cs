using System;
using System.Security.Claims;
using Application.Commands.UserActionTrackings;
using MediatR;

namespace API.GraphQL.Mutations;

[ExtendObjectType("Mutation")]
public class UserActionTrackingMutation
{
    [GraphQLName("createUserActionTracking")]
    public async Task<int> CreateUserActionTracking([Service] IMediator _mediator, [Service] IHttpContextAccessor httpContextAccessor, string productId, string actionType)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return -1;
        var appResult = await _mediator.Send(new CreateUserActionTrackingCommand { UserId = userId, ProductId = productId, ActionType = actionType });
        return appResult.Value;
    }
}
