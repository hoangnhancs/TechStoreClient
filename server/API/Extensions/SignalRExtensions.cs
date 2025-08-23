using System;
using API.SignalR;

namespace API.Extensions;

public static class SignalRExtensions
{
    public static IServiceCollection AddSignalRConfig(this IServiceCollection services)
    {
        services.AddSignalR();
        return services;
    }
    public static IEndpointRouteBuilder MapSignalRHubs(this IEndpointRouteBuilder app)
    {
        app.MapHub<CommentHub>("/commentHub");
        app.MapHub<ReviewHub>("/reviewHub");
        app.MapHub<NotificationHub>("/notificationHub");
        return app;
    }
}
