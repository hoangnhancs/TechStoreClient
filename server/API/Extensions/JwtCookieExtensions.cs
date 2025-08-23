using System;
using System.Text;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class JwtCookieExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var jwtKey = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not found in appsettings.json");
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                IssuerSigningKey = signingKey
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Request.Cookies.TryGetValue("access_token", out var accessToken);
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception is SecurityTokenExpiredException)
                    {
                        if (context.Request.Cookies.TryGetValue("access_token", out var _))
                            context.Response.Headers.Append("token-expired", "true");
                        context.Response.StatusCode = 401;
                    }

                    return Task.CompletedTask;
                }
            };

        });
        return services;
    }

    public static IServiceCollection AddAppCookiePolicy(this IServiceCollection services)
    {
        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.SameSite = SameSiteMode.None;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        });
        services.Configure<CookiePolicyOptions>(options =>
        {
            options.MinimumSameSitePolicy = SameSiteMode.None;
            options.Secure = CookieSecurePolicy.Always;
        });
        return services;
    }


    public static IServiceCollection AddAppAuthorization(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            // Policy yêu cầu MFA (2FA)
            options.AddPolicy("Require2FA", policy =>
            {
                policy.RequireClaim("amr", "mfa"); // Check multifactor
            });

            // Policy yêu cầu SecurityStampRequirement
            options.AddPolicy("SecurityStampRequirement", policy =>
            {
                policy.Requirements.Add(new SecurityStampRequirement());
            });

            // Policy yêu cầu IsAdminRequirement
            options.AddPolicy("IsAdminRequirement", policy =>
            {
                policy.Requirements.Add(new IsAdminRequirement());
            });
        });

        services.AddTransient<IAuthorizationHandler, SecurityStampRequirementHandler>();
        services.AddTransient<IAuthorizationHandler, IsAdminRequirementHandler>();

        return services;
    }

    public static IServiceCollection AddAppAuthentication(this IServiceCollection services)
    {
        services.ConfigureApplicationCookie(options =>
        {
            options.ExpireTimeSpan = TimeSpan.FromDays(7);
            options.SlidingExpiration = true;
            options.Cookie.IsEssential = true;
        });

        services.Configure<SecurityStampValidatorOptions>(opt =>
        {
            opt.ValidationInterval = TimeSpan.FromMinutes(15);
        });

        services.Configure<DataProtectionTokenProviderOptions>(options =>
        {
            options.TokenLifespan = TimeSpan.FromMinutes(15);
        });

        return services;
    }

    public static IApplicationBuilder UseAuthorizationFromCookie(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            var token = context.Request.Cookies["access_token"];
            if (!string.IsNullOrEmpty(token))
                context.Request.Headers.Append("Authorization", "Bearer " + token);
            await next();
        });
    }
}
