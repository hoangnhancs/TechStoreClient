using System;
using Application.Queries.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}
