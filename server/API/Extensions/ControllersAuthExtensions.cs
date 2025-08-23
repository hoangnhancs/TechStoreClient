using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace API.Extensions;

public static class ControllersAuthExtensions
{
    public static IServiceCollection AddControllersWithGlobalAuth(this IServiceCollection services)
    {
        services.AddControllers(opt =>
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
            opt.Filters.Add(new AuthorizeFilter(policy));
        });
        return services;
    }

}
