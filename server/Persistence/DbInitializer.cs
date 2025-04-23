using System;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
namespace Persistence;

public class DbInitializer
{
    public static async Task SeedData(StoreContext context, UserManager<User> userManager)
    {

        if (!userManager.Users.Any())
        {
            var user = new User
            {
                DisplayName = "Bob",
                UserName = "bob@gmail.com",
                Email = "bob@gmail.com"
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
            var bobBasket = new Basket { UserId = user.Id };
            context.Baskets.Add(bobBasket);

            var admin = new User
            {
                DisplayName = "Admin",
                UserName = "admin@gmail.com",
                Email = "admin@gmail.com"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, ["Member", "Admin"]);
            var adminBasket = new Basket { UserId = admin.Id };
            context.Baskets.Add(adminBasket);

        }

        if (context.Products.Any()) return;

        var products = new List<Product>
        {
            new() {

                Name = "Angular Speedster Board 2000",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 20000,
                ImageUrl = "/images/products/sb-ang1.png",
                Brand = "Angular",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "Green Angular Board 3000",
                Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                Price = 15000,
                ImageUrl = "/images/products/sb-ang2.png",
                Brand = "Angular",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "Core Board Speed Rush 3",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 18000,
                ImageUrl = "/images/products/sb-core1.png",
                Brand = "NetCore",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "Net Core Super Board",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                Price = 30000,
                ImageUrl = "/images/products/sb-core2.png",
                Brand = "NetCore",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "React Board Super Whizzy Fast",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 25000,
                ImageUrl = "/images/products/sb-react1.png",
                Brand = "React",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "Categoryscript Entry Board",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 12000,
                ImageUrl = "/images/products/sb-ts1.png",
                Brand = "CategoryScript",
                Category = "Boards",
                QuantityInStock = 100
            },
            new() {

                Name = "Core Blue Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1000,
                ImageUrl = "/images/products/hat-core1.png",
                Brand = "NetCore",
                Category = "Hats",
                QuantityInStock = 100
            },
            new() {

                Name = "Green React Woolen Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 8000,
                ImageUrl = "/images/products/hat-react1.png",
                Brand = "React",
                Category = "Hats",
                QuantityInStock = 100
            },
            new() {

                Name = "Purple React Woolen Hat",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1500,
                ImageUrl = "/images/products/hat-react2.png",
                Brand = "React",
                Category = "Hats",
                QuantityInStock = 100
            },
            new() {

                Name = "Blue Code Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1800,
                ImageUrl = "/images/products/glove-code1.png",
                Brand = "VS Code",
                Category = "Gloves",
                QuantityInStock = 100
            },
            new() {

                Name = "Green Code Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1500,
                ImageUrl = "/images/products/glove-code2.png",
                Brand = "VS Code",
                Category = "Gloves",
                QuantityInStock = 100
            },
            new() {

                Name = "Purple React Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1600,
                ImageUrl = "/images/products/glove-react1.png",
                Brand = "React",
                Category = "Gloves",
                QuantityInStock = 100
            },
            new() {

                Name = "Green React Gloves",
                Description =
                    "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 1400,
                ImageUrl = "/images/products/glove-react2.png",
                Brand = "React",
                Category = "Gloves",
                QuantityInStock = 100
            },
            new() {

                Name = "Redis Red Boots",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 25000,
                ImageUrl = "/images/products/boot-redis1.png",
                Brand = "Redis",
                Category = "Boots",
                QuantityInStock = 100
            },
            new() {

                Name = "Core Red Boots",
                Description =
                    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                Price = 18999,
                ImageUrl = "/images/products/boot-core2.png",
                Brand = "NetCore",
                Category = "Boots",
                QuantityInStock = 100
            },
            new() {

                Name = "Core Purple Boots",
                Description =
                    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                Price = 19999,
                ImageUrl = "/images/products/boot-core1.png",
                Brand = "NetCore",
                Category = "Boots",
                QuantityInStock = 100
            },
            new() {

                Name = "Angular Purple Boots",
                Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                Price = 15000,
                ImageUrl = "/images/products/boot-ang2.png",
                Brand = "Angular",
                Category = "Boots",
                QuantityInStock = 100
            },
            new() {

                Name = "Angular Blue Boots",
                Description =
                    "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                Price = 18000,
                ImageUrl = "/images/products/boot-ang1.png",
                Brand = "Angular",
                Category = "Boots",
                QuantityInStock = 100
            }

        };
        context.Products.AddRange(products);

        await context.SaveChangesAsync();
    }

}
