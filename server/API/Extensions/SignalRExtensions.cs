using System;
using API.SignalR;
using StackExchange.Redis;

namespace API.Extensions;

public static class SignalRExtensions
{
    public static IServiceCollection AddSignalRConfig(this IServiceCollection services)
    {
        services.AddSignalR()
            .AddStackExchangeRedis("localhost:6379", options =>
                {
                    options.Configuration.ChannelPrefix = RedisChannel.Pattern("MyAppSignalR");
                });
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
