using System;
using API.Middleware;

namespace API.Extensions;

public static class MiddlewareExtensions
{
    public static IServiceCollection AddGlobalMiddlewareException(this IServiceCollection services)
    {
        services.AddTransient<ExceptionMiddleware>();
        return services;
    }
    public static IApplicationBuilder UseGlobalMiddlewareException(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        return app;
    }

}
