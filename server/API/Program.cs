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

// Add services to the container.

builder.Services.AddControllersWithGlobalAuth(); //apply auth for all controllers
builder.Services.AddSwaggerDocs();
builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddGraphQlServerConfig();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddPersistenceServices(builder.Configuration);


builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAppAuthentication();
builder.Services.AddAppCookiePolicy();
builder.Services.AddAppAuthorization();


builder.Services.AddGlobalMiddlewareException();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSignalRConfig();
builder.Services.AddHttpContextAccessor();
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    opt.SignIn.RequireConfirmedEmail = true;
})
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();

// builder.Logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.None); //ignore logging from entity

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerDocs();
    app.UseHttpsRedirection();
}

app.UseAuthorizationFromCookie();
app.UseCookiePolicy();
app.UseGlobalMiddlewareException();
app.UseCorsPolicy();
app.UseAuthentication();
app.UseAuthorization();
// app.UseDefaultFiles(); //chi dung khi deloy static files FE
// app.UseStaticFiles();
app.MapControllers();
app.MapGraphQlEndpoint();
app.MapGroup("api").MapIdentityApi<User>(); //chuyen tu api/account thanh api
app.MapSignalRHubs();
// app.MapFallbackToController("Index", "Fallback"); //chi dung khi deloy static files FE
await app.ApplyMigrationsAndSeedData();

app.Run();
