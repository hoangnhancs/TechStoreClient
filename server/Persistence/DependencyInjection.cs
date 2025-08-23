using System;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Repositories;

namespace Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration config)
    {
        // DbContext (PostgreSQL + SnakeCase)
        services.AddDbContext<StoreContext>(options =>
        {
            var connStr = config.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connStr).UseSnakeCaseNamingConvention();
        });

        // Repositories + UoW
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IBasketRepository, BasketRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IFilterTagValueRepository, FilterTagValueRepository>();
        services.AddScoped<IFilterTagRepository, FilterTagRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IPhotoRepository, PhotoRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IBannerRepository, BannerRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<INotificationGroupRepository, NotificationGroupRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IProductVectorEmbeddingRepository, ProductVectorEmbeddingRepository>();
        services.AddScoped<IUserActionTrackingRepository, UserActionTrackingRepository>();
        services.AddScoped<IFlashSaleProductRepository, FlashSaleProductRepository>();

        return services;
    }
}
