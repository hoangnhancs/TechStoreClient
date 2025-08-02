using System;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;

namespace Persistence;

public class DbInitializer
{
    public class BrandGroup
    {
        public int categoryId { get; set; }
        public required string category { get; set; }
        public List<BrandDto> brands { get; set; } = [];
    }

    public class BrandDto
    {
        public required string name { get; set; }
        public required string imageUrl { get; set; }
    }

    public static async Task SeedData(StoreContext context, UserManager<User> userManager, ILogger<DbInitializer> logger)
    {

        List<string> categories = new List<string> { "camera", "laptop", "microphone", "monitor", "pc", "phone", "printer", "tablet", "tv", "watch" };

        //add category
        if (!context.Categories.Any())
        {
            var categoryEntities = categories
                .Select((name, idx) => new Category
                {
                    Name = name
                })
                .ToList();
            await context.Categories.AddRangeAsync(categoryEntities);
            await context.SaveChangesAsync();
        }
        var categoriesInDb = context.Categories.ToList();

        var basePath = Path.Combine(AppContext.BaseDirectory, "SeedData");
        string jsonContent = File.ReadAllText(Path.Combine(basePath, "tags_dict.json"));
        var tagsDict = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, List<string>>>>(jsonContent);

        //add filtertag
        if (!context.FilterTags.Any())
        {
            if (tagsDict == null)
            {
                throw new Exception("Failed to deserialize tags dictionary from JSON file.");
            }

            // var filterTags = new List<FilterTag>();
            foreach (var tag in tagsDict)
            {
                var matchedCat = categoriesInDb.FirstOrDefault(c => c.Name == tag.Key);
                if (matchedCat == null)
                {
                    throw new Exception($"Category '{tag.Key}' not found in the database.");
                }
                var filterTags = tag.Value;
                foreach (var filterTag in filterTags)
                {
                    var tagEntity = new FilterTag
                    {
                        Name = filterTag.Key,
                        CategoryId = matchedCat.Id
                    };
                    await context.FilterTags.AddAsync(tagEntity);
                    await context.SaveChangesAsync();
                    var matchedTagFilter = await context.FilterTags.FirstOrDefaultAsync(ft => ft.Name == filterTag.Key && ft.CategoryId == matchedCat.Id);
                    var tagValues = filterTag.Value;
                    var tagValuesEntity = new List<FilterTagValue>();
                    foreach (var tagValue in tagValues)
                    {
                        if (matchedTagFilter == null)
                        {
                            throw new Exception($"FilterTag '{filterTag.Key}' not found for category '{matchedCat.Name}'.");
                        }
                        tagValuesEntity.Add(new FilterTagValue
                        {
                            Value = tagValue,
                            FilterTagId = matchedTagFilter.Id
                        });
                    }
                    await context.FilterTagValues.AddRangeAsync(tagValuesEntity);
                    await context.SaveChangesAsync();
                }
            }
        }

        List<dynamic> items = new List<dynamic>();
        foreach (var cat in categories)
        {
            // var json = File.ReadAllText($"D:/E-Commerce Store/ProductData/Json_data/{cat}_final_data.json");
            var json = File.ReadAllText(Path.Combine(basePath, $"{cat}_final_data.json"));
            var arr = JsonConvert.DeserializeObject<List<dynamic>>(json);
            if (arr != null)
            {
                items.AddRange(arr);
            }
        }

        //add brands
        if (!context.Brands.Any())
        {
            var jsonBrands = File.ReadAllText(Path.Combine(basePath, "brands.json"));
            var brandsByCategory = JsonConvert.DeserializeObject<List<BrandGroup>>(jsonBrands);
            if (brandsByCategory == null)
            {
                throw new Exception("Failed to deserialize brands from JSON file.");
            }
            Console.WriteLine("Adding Brands");
            Console.WriteLine("Count: " + brandsByCategory.Count);
            foreach (var brandByCat in brandsByCategory)
            {
                var matchedCat = categoriesInDb.FirstOrDefault(c => c.Name.ToLower() == brandByCat.category.ToLower() && c.Id == brandByCat.categoryId);
                if (matchedCat == null)
                {
                    throw new Exception($"Category '{brandByCat.category}' not found in the database.");
                }
                foreach (var brand in brandByCat.brands)
                {
                    var brandEntity = new Brand
                    {
                        Name = brand.name,
                        CategoryId = matchedCat.Id,
                        ImageUrl = brand.imageUrl
                    };
                    await context.Brands.AddAsync(brandEntity);
                }
            }
            await context.SaveChangesAsync();
        }

        //add user
        if (!userManager.Users.Any())
        {
            var userNames = new List<string>() { "Bob", "Jane", "Tom", "Erik", "Philip", "Ralph", "Join", "Sam", "Ken", "Timmy" };

            foreach (var userName in userNames)
            {
                var user = new User
                {
                    DisplayName = userName,
                    UserName = $"{userName.ToLower()}@gmail.com",
                    Email = $"{userName.ToLower()}@gmail.com"
                };
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
                var basket = new Basket { UserId = user.Id };
                context.Baskets.Add(basket);
            }

            var admin1 = new User
            {
                DisplayName = "Admin",
                UserName = "admin@gmail.com",
                Email = "admin@gmail.com",
                IsAdmin = true
            };

            await userManager.CreateAsync(admin1, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin1, ["Member", "Admin"]);
            var admin1Basket = new Basket { UserId = admin1.Id };
            context.Baskets.Add(admin1Basket);

            var admin2 = new User
            {
                DisplayName = "Hoàng Nhân",
                UserName = "thaihoangnhantk17lqd@gmail.com",
                Email = "thaihoangnhantk17lqd@gmail.com",
                IsAdmin = true
            };

            await userManager.CreateAsync(admin2, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin2, ["Member", "Admin"]);
            var admin2Basket = new Basket { UserId = admin2.Id };
            context.Baskets.Add(admin2Basket);

        }


        //add product
        if (!context.Products.Any())
        {
            var products = new List<Product>();
            foreach (var item in items)
            {
                var filterTags = new List<ProductTagFilter>();
                if (item.filter_tags != null)
                {
                    foreach (var prop in item.filter_tags)
                    {
                        string key = prop.Name;
                        string value = prop.Value.ToString();
                        string itemCategoryLower = ((string)item.category).ToLower();
                        var filterTagValue = await context.FilterTagValues
                            .Include(ftv => ftv.FilterTag)
                            .FirstOrDefaultAsync(ftv =>
                                ftv.FilterTag!.Category!.Name.ToLower() == itemCategoryLower &&
                                ftv.FilterTag.Name.ToLower() == key.ToLower() &&
                                ftv.Value.ToLower() == value.ToLower());
                        if (filterTagValue != null)
                        {
                            var filterTag = new ProductTagFilter
                            {
                                FilterTagValueId = filterTagValue.Id,
                            };
                            filterTags.Add(filterTag);
                        }
                    }
                }
                var detailImages = new List<ProductImage>();
                if (item.imgs != null)
                {
                    foreach (var img in item.imgs)
                    {
                        detailImages.Add(new ProductImage { ImageUrl = img.ToString() });
                    }
                }
                var attributes = new List<ProductAttribute>();
                if (item.attributes != null)
                {
                    foreach (var attr in item.attributes)
                    {
                        attributes.Add(new ProductAttribute
                        {
                            Name = attr.name,
                            Value = attr.value.ToString(),
                            DisplayOrder = attr.displayorder,
                            AttributeType = attr.type.ToString()
                        });
                    }
                }
                var displayTags = new List<ProductTag>();
                if (item.tags != null)
                {
                    foreach (var tag in item.tags)
                    {
                        displayTags.Add(new ProductTag
                        {
                            Tag = tag.ToString()
                        });
                    }
                }
                var descriptions = new List<string>();
                if (item.descriptions != null)
                {
                    foreach (var desc in item.descriptions)
                    {
                        descriptions.Add(desc.ToString());
                    }
                }
                var matchedCategory = categoriesInDb.FirstOrDefault(c => c.Name == item.category.ToString());
                if (matchedCategory == null)
                {
                    throw new Exception($"Category '{item.category}' not found for product '{item.name}'");
                }
                string brandName = item.brand.ToString();
                var product = new Product
                {
                    Name = item.name,
                    Description = descriptions,
                    OldPrice = item.old_price,
                    Price = item.price,
                    DiscountPercentage = item.discount,
                    CategoryId = matchedCategory.Id,
                    BrandId = context.Brands.FirstOrDefault(b => b.Name == brandName && b.CategoryId == matchedCategory.Id)?.Id ?? throw new Exception($"Brand '{item.brand}' not found for product '{item.name}'"),
                    Brand = context.Brands.FirstOrDefault(b => b.Name == brandName && b.CategoryId == matchedCategory.Id) ?? throw new Exception($"Brand '{item.brand}' not found for product '{item.name}'"),
                    MainImageUrl = item.image_url,
                    QuantityInStock = 1000,
                    UrlSlug = item.urlslug,
                    MetaTitle = item.metatitle,
                    MetaDescription = item.metadescription,
                    MetaKeywords = item.metakeywords,
                    DisplayTags = displayTags,
                    ProductTagFilters = filterTags,
                    Reviews = new List<Review>(),
                    DetailImages = detailImages,
                    Attributes = attributes,
                };
                products.Add(product);
            }
            await context.Products.AddRangeAsync(products);
        }


        var newNotificationGroup = new NotificationGroup
        {
            Name = "admin-notifications",
        };

        if (!context.NotificationGroups.Any())
        {
            await context.NotificationGroups.AddRangeAsync(newNotificationGroup);
            logger.LogInformation("Add NotificationGroup!");
            if (!context.NotificationGroupMembers.Any())
            {
                var admin1 = new NotificationGroupMember
                {
                    NotificationGroupId = newNotificationGroup.Id,
                    UserId = (await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@gmail.com"))?.Id ?? throw new Exception("Admin not found"),
                };
                var admin2 = new NotificationGroupMember
                {
                    NotificationGroupId = newNotificationGroup.Id,
                    UserId = (await context.Users.FirstOrDefaultAsync(u => u.Email == "thaihoangnhantk17lqd@gmail.com"))?.Id ?? throw new Exception("Admin not found"),
                };
                await context.NotificationGroupMembers.AddRangeAsync(admin1);
                await context.NotificationGroupMembers.AddRangeAsync(admin2);
                logger.LogInformation("Add admins to NotificationGroup!");
            }
            else
            {
                logger.LogInformation("Notification group member already exists");
            }
        }
        else
        {
            logger.LogInformation("Notification group already exists");
        }

        // if (!context.Addresses.Any())
        // {
        //     string jsonContent = File.ReadAllText(Path.Combine(basePath, "addresses.json"));
        // }

        await context.SaveChangesAsync();
    }
}
