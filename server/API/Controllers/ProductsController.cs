using System;
using System.Security.Claims;
using API.DTOs;
using Application.Commands.Products;
using Application.DTOs;
using Application.Queries.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;


namespace API.Controllers;

public class ProductsController : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        return HandleAppResult(await Mediator.Send(new GetProductListQuery()));
    }

    [AllowAnonymous]
    [HttpGet("top10")]
    public async Task<IActionResult> GetTop10ProductsPerCategory()
    {
        return HandleAppResult(await Mediator.Send(new GetTop10ProductPerCategoryQuery()));
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductDetails(string id)
    {
        return HandleAppResult(await Mediator.Send(new GetProductDetailsQuery { ProductId = id }));
    }

    [AllowAnonymous]
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetProductsByCategory(int categoryId)
    {
        return HandleAppResult(await Mediator.Send(new GetProductListByCategoryQuery { CategoryId = categoryId }));
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateNewProduct([FromForm] CreateProductDto createProductDto)
    {
        return HandleAppResult(await Mediator.Send(new CreateNewProductCommand
        {
            ProductDto = new ProductDto
            {
                Name = createProductDto.Name,
                Description = new List<string> { createProductDto.Description },
                OldPrice = createProductDto.OldPrice,
                DiscountPercentage = createProductDto.Discount,
                Price = createProductDto.OldPrice * (100 - createProductDto.Discount) / 100,
                CategoryId = int.TryParse(createProductDto.CategoryId, out var catId) ? catId : 0,
                BrandId = createProductDto.BrandId,
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
            AttributeGroups = JsonConvert.DeserializeObject<List<ProductAttributeGroupDto>>(createProductDto.AttributeGroupsJson)
                  ?? [],
        }));
    }

    [HttpPut("manage/{id}")]
    public async Task<IActionResult> UpdateProduct([FromRoute] string id, [FromForm] UpdateProductDto updateProductDto)
    {
        var mainImageInput = new SingleImageInput
        {
            File = updateProductDto.MainImageFile,
            Url = updateProductDto.MainImageUrl
        };

        var detailImageInput = new ListImageInput
        {
            Files = updateProductDto.DetailImageFiles,
            Urls = updateProductDto.DetailImageUrls
        };

        return HandleAppResult(await Mediator.Send(new UpdateProductCommand
        {
            ProductDto = new ProductDto
            {
                Id = id,
                Name = updateProductDto.Name,
                Description = new List<string> { updateProductDto.Description },
                OldPrice = updateProductDto.OldPrice,
                DiscountPercentage = updateProductDto.Discount,
                Price = updateProductDto.OldPrice * (100 - updateProductDto.Discount) / 100,
                CategoryId = int.TryParse(updateProductDto.CategoryId, out var catId) ? catId : 0,
                BrandId = updateProductDto.BrandId,
                QuantityInStock = updateProductDto.QuantityInStock,
            },
            MainImageInput = mainImageInput,
            DetailImageInputs = detailImageInput,
            FilterTags = updateProductDto.FilterTags,
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
            AttributeGroups = JsonConvert.DeserializeObject<List<ProductAttributeGroupDto>>(updateProductDto.AttributeGroupsJson)
                  ?? [],
        }));
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct([FromQuery] string id)
    {
        return HandleAppResult(await Mediator.Send(new DeleteProductCommand { ProductId = id }));
    }

    [HttpGet("suggestion")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSuggestionProducts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return HandleAppResult(await Mediator.Send(new GetSuggestionProductQuery { UserId = userId }));
    }

    [HttpPost("generate_product_vector")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GenerateProductVector()
    {
        return HandleAppResult(await Mediator.Send(new GenerateProductVector.Command()));
    }
}
