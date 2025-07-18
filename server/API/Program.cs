using System.Text;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Application.Interface;
using Application.Mappers;
using Application.Queries.Products;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Infrastructure.Email;
using Infrastructure.Helper;
using Infrastructure.Photo;
using Infrastructure.Security;
using Infrastructure.Service;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Persistence;
using Persistence.Repositories;
using Resend;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    builder.WebHost.UseUrls("http://0.0.0.0:8080"); //product moi dung cai nay, con khong thi mac dinh 5001
}
// builder.WebHost.UseUrls("http://0.0.0.0:8080");

// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

// builder.Services.AddDbContext<StoreContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<StoreContext>(options =>
{
    var connStr = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connStr) // Dùng Npgsql cho PostgreSQL
        .UseSnakeCaseNamingConvention(); //name convert theo chuan postgres  
});

builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors();
builder.Services.AddSignalR();


builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = builder.Configuration["Resend:ApiKey"]!;        // appsettings.json
});
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddTransient<IEmailSender<User>, EmailSender>();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetProductDetailsHandler>());
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IFilterTagValueRepository, FilterTagValueRepository>();
builder.Services.AddScoped<IFilterTagRepository, FilterTagRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IUserAccessor, UserAccessor>();
builder.Services.AddScoped<ITokenServices, TokenServices>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<IHttpContextAccessorHelper, HttpContextAccessorHelper>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IPhotoRepository, PhotoRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IPhotoService, PhotoService>();


builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

builder.Services.AddHttpContextAccessor();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    opt.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();
// builder.Services.Configure<BearerTokenOptions>(options =>
// {
//     options.BearerTokenExpiration = TimeSpan.FromMinutes(3); // access token sống 3 phút
//     options.RefreshTokenExpiration = TimeSpan.FromDays(7);   // refresh token sống 7 ngày
// });
builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("SecurityStampRequirement", policy =>
    {
        policy.Requirements.Add(new SecurityStampRequirement());
    });
    opt.AddPolicy("IsAdminRequirement", policy =>
    {
        policy.Requirements.Add(new IsAdminRequirement());
    });
});
builder.Services.AddTransient<IAuthorizationHandler, SecurityStampRequirementHandler>();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromDays(7); // Cookie sống 7 ngày
    options.SlidingExpiration = true;              // Cứ dùng là gia hạn thêm
    options.Cookie.IsEssential = true;
});

builder.Services.Configure<SecurityStampValidatorOptions>(opt =>
{
    opt.ValidationInterval = TimeSpan.FromMinutes(15); // Auto check mỗi 15p
});
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
{
    options.TokenLifespan = TimeSpan.FromMinutes(15); //email song 15'
});
builder.Services.Configure<CloudinarySetting>(builder.Configuration
    .GetSection("CloudinarySettings"));
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAppCookiePolicy();
builder.Services.AddAppAuthorization();
builder.Services.AddAuditLogging();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["access_token"];
    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Append("Authorization", "Bearer " + token);
    }
    await next();
});

app.UseCookiePolicy();
app.UseHttpsRedirection();



app.UseMiddleware<ExceptionMiddleware>();


app.UseCors(options =>
{
    options
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins("https://localhost:3000", "https://e-commerce-store-five-azure.vercel.app")
        .WithExposedHeaders("token-expired", "token-expired2", "token-expired3");
});

// app.Use(async (context, next) =>
// {
//     Console.WriteLine("ACCESS TOKEN COOKIE: " + context.Request.Cookies["access_token"]);
//     Console.WriteLine("AUTH HEADER: " + context.Request.Headers["Authorization"]);
//     await next();
// });

app.UseAuthentication();
app.UseAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); //chuyen tu api/account thanh api
app.MapHub<CommentHub>("/commentHub");
app.MapHub<ReviewHub>("/reviewHub");
app.MapFallbackToController("Index", "Fallback");
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<StoreContext>();
    //o dong nay, context đã có sẵn dữ liệu từ database, vì nó được lấy từ DI container,
    // và Entity Framework Core sẽ tự động kết nối với database mà bạn đã cấu hình.
    var userManager = services.GetRequiredService<UserManager<User>>();
    await context.Database.MigrateAsync();
    //chi kiem tra schema, k kiem tra data
    await DbInitializer.SeedData(context, userManager);
    //thuc hien seed data trong \Persistence\DbInitializer.cs
    //data se duoc add vao db o line nay
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration.");
    throw;
}

app.Run();
