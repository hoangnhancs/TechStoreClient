using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class IsAdminRequirement : IAuthorizationRequirement
{

}

public class IsAdminRequirementHandler : AuthorizationHandler<IsAdminRequirement>
{
    private readonly StoreContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsAdminRequirementHandler(StoreContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext authContext, IsAdminRequirement requirement)
    {
        var userId = authContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return ;
        var isAdmin = await _context.UserRoles.AnyAsync(
            ur => ur.UserId == userId && _context.Roles.Any(r => r.Id == ur.RoleId && r.Name == "Admin")
        );
        if (isAdmin)
        {
            authContext.Succeed(requirement);
        }
    }
}
