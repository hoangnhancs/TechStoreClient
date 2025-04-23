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

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole { Id = "9c47b469-293b-406c-8078-e82a8f2d7072", Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = "6b35a1c6-4a79-4154-bc92-7d65a5602676", Name = "Member", NormalizedName = "MEMBER" }
            );

        builder.Entity<Basket>()
            .HasOne(b => b.User)
            .WithOne(u => u.Basket) // Navigation property ngược lại trong User
            .HasForeignKey<Basket>(b => b.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.NoAction);

        // Order → User
        builder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Ordereds) // Navigation property ngược lại trong User
            .HasForeignKey(o => o.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.NoAction);

        // Order → Basket
        builder.Entity<Order>()
            .HasOne(o => o.Basket)
            .WithMany() // Không cần navigation property ngược lại
            .HasForeignKey(o => o.BasketId) // Chỉ định BasketId là khóa ngoại
            .OnDelete(DeleteBehavior.Cascade);

        // Payment → User
        builder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany(u => u.Payments) // Navigation property ngược lại trong User
            .HasForeignKey(p => p.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany(u => u.Payments) // Navigation property ngược lại trong User
            .HasForeignKey(p => p.UserId) // Chỉ định UserId là khóa ngoại
            .OnDelete(DeleteBehavior.NoAction);

        // Payment → Order
        builder.Entity<Payment>()
            .HasOne(p => p.Order)
            .WithMany() // Không cần navigation property ngược lại
            .HasForeignKey(p => p.OrderId) // Chỉ định OrderId là khóa ngoại
            .OnDelete(DeleteBehavior.Cascade);
    }
}