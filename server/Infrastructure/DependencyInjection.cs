using System;
using Application.Interface;
using Domain.Entities;
using Infrastructure.Email;
using Infrastructure.Helper;
using Infrastructure.Photo;
using Infrastructure.Security;
using Infrastructure.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Resend;
using StackExchange.Redis;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration config)
    {
        // Redis connection (Infrastructure owns the package + creation)
        services.AddSingleton<IConnectionMultiplexer>(sp =>
            ConnectionMultiplexer.Connect(config.GetConnectionString("Redis") ?? "localhost:6379")
        );

        // Email (Resend)
        services.AddHttpClient<ResendClient>();
        services.Configure<ResendClientOptions>(o =>
        {
            o.ApiToken = config["Resend:ApiKey"]!;
        });
        services.AddTransient<IResend, ResendClient>();
        services.AddTransient<IEmailSender<User>, EmailSender>();

        // Cloudinary
        services.Configure<CloudinarySetting>(config.GetSection("CloudinarySettings"));
        services.AddScoped<IPhotoService, PhotoService>();

        // Helpers
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IHttpContextAccessorHelper, HttpContextAccessorHelper>();

        // Security/Token
        services.AddScoped<IUserAccessor, UserAccessor>();
        services.AddScoped<ITokenServices, TokenServices>();
        
        // Payments
        services.AddScoped<IPaymentService, PaymentService>();

        return services;
    }
}
