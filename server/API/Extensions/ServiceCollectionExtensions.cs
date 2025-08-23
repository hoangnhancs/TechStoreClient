using System;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ServiceCollectionExtensions
{
    // public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    // {
    //     var jwtKey = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not found in appsettings.json");
    //     var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    //     services.AddAuthentication(options =>
    //     {
    //         options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    //         options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    //         options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    //     })
    //     .AddJwtBearer(options =>
    //     {
    //         options.SaveToken = true;
    //         options.TokenValidationParameters = new TokenValidationParameters
    //         {
    //             ValidateIssuer = true,
    //             ValidateAudience = true,
    //             ValidateLifetime = true,
    //             ValidateIssuerSigningKey = true,
    //             ValidIssuer = config["Jwt:Issuer"],
    //             ValidAudience = config["Jwt:Audience"],
    //             IssuerSigningKey = signingKey
    //         };
    //         options.Events = new JwtBearerEvents
    //         {
    //             OnMessageReceived = context =>
    //             {
    //                 context.Request.Cookies.TryGetValue("access_token", out var accessToken);
    //                 if (!string.IsNullOrEmpty(accessToken))
    //                 {
    //                     context.Token = accessToken;
    //                 }
    //                 return Task.CompletedTask;
    //             },
    //             OnAuthenticationFailed = context =>
    //             {
    //                 if (context.Exception is SecurityTokenExpiredException)
    //                 {
    //                     if (context.Request.Cookies.TryGetValue("access_token", out var _))
    //                         context.Response.Headers.Append("token-expired", "true");
    //                     context.Response.StatusCode = 401;
    //                 }

    //                     return Task.CompletedTask;
    //             }
    //         };

    //     });
    //     return services;
    // }
    // public static IServiceCollection AddAppCookiePolicy(this IServiceCollection services)
    // {
    //     services.ConfigureApplicationCookie(options =>
    //     {
    //         options.Cookie.SameSite = SameSiteMode.None; //Cho phép cookie được gửi cross-site (FE gửi cookie sang BE khác domain/port) — cần cho React ↔ .NET
    //         options.Cookie.SecurePolicy = CookieSecurePolicy.Always; //Bắt buộc cookie chỉ gửi qua HTTPS
    //     });

    //     services.Configure<CookiePolicyOptions>(options =>
    //     {
    //         options.MinimumSameSitePolicy = SameSiteMode.None;
    //         options.Secure = CookieSecurePolicy.Always;
    //     });

    //     return services;
    // }

    // public static IServiceCollection AddAppAuthorization(this IServiceCollection services)
    // {
    //     services.AddAuthorization(options =>
    //     {
    //         options.AddPolicy("Require2FA", policy =>
    //         {
    //             policy.RequireClaim("amr", "mfa"); // Check multifactor
    //         });
    //     });

    //     return services;
    // }

    // public static IServiceCollection AddControllersWithAuthPolicy(this IServiceCollection services)
    // {
    //     services.AddControllers(opt =>
    //     {
    //         var policy = new AuthorizationPolicyBuilder()
    //             .RequireAuthenticatedUser()
    //             .Build();
    //         opt.Filters.Add(new AuthorizeFilter(policy));
    //     });
    //     return services;
    // }

    // public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
    // {
    //     services.AddEndpointsApiExplorer();
    //     services.AddSwaggerGen(c =>
    //     {
    //         c.SwaggerDoc("v1", new() { Title = "My API", Version = "v1" });
    //         c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //         {
    //             In = ParameterLocation.Header,
    //             Name = "Authorization",
    //             Type = SecuritySchemeType.ApiKey,
    //             Description = "Enter 'Bearer {token}'"
    //         });
    //         c.AddSecurityRequirement(new OpenApiSecurityRequirement
    //         {
    //             {
    //                 new OpenApiSecurityScheme
    //                 {
    //                     Reference = new OpenApiReference
    //                     {
    //                         Type = ReferenceType.SecurityScheme,
    //                         Id = "Bearer"
    //                     }
    //                 },
    //                 Array.Empty<string>()
    //             }
    //         });
    //     });
    //     return services;
    // }

    // public static IServiceCollection AddDbContextWithPostgres(this IServiceCollection services, IConfiguration config)
    // {
    //     services.AddDbContext<StoreContext>(options =>
    //     {
    //         var connStr = config.GetConnectionString("DefaultConnection");
    //         options.UseNpgsql(connStr)
    //                .UseSnakeCaseNamingConvention();
    //     });
    //     return services;
    // }

    // public static IServiceCollection AddAuditLogging(this IServiceCollection services)
    // {
    //     // Bạn có thể thêm logger + middleware ở đây nếu cần
    //     // Ví dụ: services.AddScoped<IAuditLogger, AuditLogger>();
    //     return services;
    // }
}
