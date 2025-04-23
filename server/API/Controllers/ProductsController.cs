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
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetProductDetailsQuery { ProductId = id }));
    }
}
