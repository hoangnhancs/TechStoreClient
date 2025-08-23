using System;

namespace API.Extensions;

public static class CorsExtensions
{
    private const string PolicyName = "AppCors";
    public static IServiceCollection AddCorsPolicy(this IServiceCollection
    services, IConfiguration config)
    {
        var allowedOrigins = new[]
        {
            "https://localhost:3000",
            "https://e-commerce-store-five-azure.vercel.app"
        };
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins(allowedOrigins)
                    .WithExposedHeaders("token-expired", "token-expired2",
                    "token-expired3");
            });
        });
        return services;
    }

    public static IApplicationBuilder UseCorsPolicy(this IApplicationBuilder app)
        => app.UseCors(PolicyName);
}
