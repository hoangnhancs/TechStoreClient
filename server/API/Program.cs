using API.Extensions;
using Application;
using Domain.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Persistence;


var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    builder.WebHost.UseUrls("http://0.0.0.0:8080"); //product moi dung cai nay, con khong thi mac dinh 5001
}
// builder.WebHost.UseUrls("http://0.0.0.0:8080");

// Add services to the container.

/*API layer*/

builder.Services.AddControllersWithGlobalAuth();
builder.Services.AddGlobalMiddlewareException();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCorsPolicy();
builder.Services.AddSignalRConfig();
builder.Services.AddGraphQlServerConfig();


/*Application layer*/
builder.Services.AddApplicationServices();


/*Persistence layer (repos + uow)*/
builder.Services.AddPersistenceServices(builder.Configuration);


/*Infastructure layer*/
builder.Services.AddInfrastructureServices(builder.Configuration);


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
builder.Services.AddAppAuthorization();
builder.Services.AddAppAuthentication();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAppCookiePolicy();
builder.Services.AddAppAuthorization();
// builder.Services.AddAuditLogging();

builder.Logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.None);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorizationFromCookie();

app.UseCookiePolicy();
// app.UseHttpsRedirection();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseGlobalMiddlewareException();

app.UseCorsPolicy();

app.UseAuthentication();
app.UseAuthorization();

// app.UseDefaultFiles();
// app.UseStaticFiles();

app.MapControllers();
app.MapGraphQlEndpoint();
app.MapGroup("api").MapIdentityApi<User>(); //chuyen tu api/account thanh api
app.MapSignalRHubs();
// app.MapFallbackToController("Index", "Fallback");

await app.ApplyMigrationsAndSeedData();

app.Run();