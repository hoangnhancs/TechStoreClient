using System;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }
    public required DbSet<Address> Addresses { get; set; }
    public required DbSet<Order> Orders { get; set; }
    public required DbSet<Payment> Payments { get; set; }
    public required DbSet<ProductImage> ProductImages { get; set; }
    public required DbSet<ProductAttribute> ProductAttributes { get; set; }
    public required DbSet<ProductTag> ProductDisplayTags { get; set; }
    public required DbSet<Category> Categories { get; set; }
    public required DbSet<ProductTagFilter> ProductTagFilters { get; set; }
    public required DbSet<Comment> Comments { get; set; }
    public required DbSet<Review> Reviews { get; set; }
    public required DbSet<FilterTag> FilterTags { get; set; }
    public required DbSet<FilterTagValue> FilterTagValues { get; set; }
    public required DbSet<RefreshToken> RefreshTokens { get; set; }
    public required DbSet<UserImage> UserImages { get; set; }
    public required DbSet<BannerImage> BannerImages { get; set; }
    public required DbSet<Notification> Notifications { get; set; }
    public required DbSet<NotificationGroup> NotificationGroups { get; set; }
    public required DbSet<NotificationGroupMember> NotificationGroupMembers { get; set; }
    public required DbSet<Brand> Brands { get; set; }
    public required DbSet<UserActionTracking> UserActionTrackings { get; set; }
    public required DbSet<ProductVectorEmbedding> ProductVectorEmbeddings { get; set; }
    public required DbSet<FlashSaleProduct> FlashSaleProducts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole { Id = "9c47b469-293b-406c-8078-e82a8f2d7072", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "6b35a1c6-4a79-4154-bc92-7d65a5602676", Name = "Member", NormalizedName = "MEMBER" }
            );

        builder.Entity<Address>()
            .HasOne(a => a.User)
            .WithMany(u => u.Addresses) // Navigation property ngược lại trong User
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Xóa Address khi xóa User

        // Order → User
        builder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Ordereds) // Navigation property ngược lại trong User
            .HasForeignKey(o => o.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.Cascade);
        builder.Entity<Order>()
            .HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict); // Không xóa Order khi xóa Address

        builder.Entity<Order>()
            .HasOne(o => o.BillingAddress)
            .WithMany()
            .HasForeignKey(o => o.BillingAddressId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict); // Không xóa Order khi xóa Address

        builder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany(u => u.Payments) // Navigation property ngược lại trong User
            .HasForeignKey(p => p.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.NoAction);
        builder.Entity<Product>()
            .Property(p => p.AverageRating)
            .HasPrecision(3, 2);
        builder.Entity<ProductTagFilter>()
            .HasOne(ptf => ptf.FilterTagValue)
            .WithMany()
            .HasForeignKey(ptf => ptf.FilterTagValueId)
            .OnDelete(DeleteBehavior.NoAction);
        builder.Entity<RefreshToken>()
            .HasKey(r => r.Id);
        builder.Entity<RefreshToken>()
            .HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Notification>()
            .HasOne(n => n.Receiver)
            .WithMany()
            .HasForeignKey(n => n.ReceiverId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);
    }
}