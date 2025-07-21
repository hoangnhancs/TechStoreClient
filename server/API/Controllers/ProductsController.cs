using System;
using API.DTOs;
using Application.Command.Product;
using Application.DTOs;
using Application.Queries.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Stripe;

namespace API.Controllers;

public class ProductsController : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        return HandleResult(await Mediator.Send(new GetProductListQuery()));
    }

    [AllowAnonymous]
    [HttpGet("top10")]
    public async Task<IActionResult> GetTop10ProductsPerCategory()
    {
        return HandleResult(await Mediator.Send(new GetTop10ProductPerCategoryQuery()));
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetProductDetailsQuery { ProductId = id }));
    }

    [AllowAnonymous]
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        return HandleResult(await Mediator.Send(new GetProductListByCategoryQuery { CategoryId = categoryId }));
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateNewProduct([FromForm] CreateProductDto createProductDto)
    {
        return HandleResult(await Mediator.Send(new CreateNewProductCommand
        {
            ProductDto = new ProductDto
            {
                Name = createProductDto.Name,
                Description = new List<string> { createProductDto.Description },
                OldPrice = createProductDto.OldPrice,
                DiscountPercentage = createProductDto.Discount,
                Price = createProductDto.OldPrice * (100 - createProductDto.Discount) / 100,
                CategoryId = int.TryParse(createProductDto.CategoryId, out var catId) ? catId : 0,
                Brand = createProductDto.Brand,
                QuantityInStock = createProductDto.QuantityInStock,
            },
            MainImageFile = createProductDto.MainImageFile,
            DetailImageFiles = createProductDto.DetailImageFiles,
            FilterTags = createProductDto.FilterTags,
            // AttributeGroups = createProductDto.AttributeGroups
            //     .Select(create_ag => new Application.Command.Product.ProductAttributeGroupDto
            //     {
            //         GroupName = create_ag.GroupName,
            //         Attributes = create_ag.Attributes
            //             .Select(a => new Application.Command.Product.ProductAttributeDto
            //             {
            //                 Key = a.Key,
            //                 Value = a.Value
            //             }).ToList()
            //     }).ToList()
            AttributeGroups = JsonConvert.DeserializeObject<List<Application.Command.Product.ProductAttributeGroupDto>>(createProductDto.AttributeGroupsJson)
                  ?? [],
        }));
    }
    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct([FromQuery] string id)
    {
        return HandleResult(await Mediator.Send(new DeleteProductCommand { ProductId = id }));
    }
}
