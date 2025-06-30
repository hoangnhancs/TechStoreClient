using System;
using System.Security.Claims;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Infrastructure.Security;

public class SecurityStampRequirement : IAuthorizationRequirement
{

}

public class SecurityStampRequirementHandler : AuthorizationHandler<SecurityStampRequirement>
{
    private readonly UserManager<User> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;


    public SecurityStampRequirementHandler(UserManager<User> userManager, IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext authContext, SecurityStampRequirement requirement)
    {
        var userId = authContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var tokenStamp = authContext.User.FindFirst("security_stamp")?.Value;
        //security_stamp tu token (JWT/cookie) hien tai
        if (string.IsNullOrEmpty(userId)) return;

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return;
        var currentStamp = await _userManager.GetSecurityStampAsync(user);
        //stamp chinh xac trong db
        if (tokenStamp == currentStamp)
        {
            authContext.Succeed(requirement);
        }
    }
}
