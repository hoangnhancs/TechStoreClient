using System;
using System.Security.Claims;
using Application.Command.Baskets;
using Application.DTOs;
using Application.Queries.Baskets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers;

[Authorize]
public class BasketController() : BaseApiController
{
    [HttpGet("mybasket")]
    public async Task<IActionResult> GetBasket()
    {
        var userId =  User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");
        
        return HandleResult(await Mediator.Send(new GetBasketQuery {UserId = userId}));
    }

    [HttpPost("mybasket/items")]
    public async Task<IActionResult> AddItemToBasket(AddItemDto addItemDto)
    {
        var identity = User.Identity;
        var isAuthenticated = identity?.IsAuthenticated ?? false;
        var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId)) 
        {
            return Unauthorized(new
            {
                message = "User not authenticated",
                isAuthenticated,
                claims,
                identityName = identity?.Name
            });
        }

        var command = new AddItemToBasketCommand
        {
            UserId = userId,
            ProductId = addItemDto.Product.Id,
            Quantity = addItemDto.Quantity
        };

        return HandleResult(await Mediator.Send(command));
    }

    [HttpDelete("mybasket/items/{productId}")]
    public async Task<IActionResult> RemoveItemFromBsket(string productId, [FromQuery]int quantity)
    {

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId)) 
        {
            return Unauthorized("User not authenticated");
        }

        var command = new RemoveItemFromBasketCommand
        {
            UserId = userId,
            ProductId = productId,
            Quantity = quantity
        };

        return HandleResult(await Mediator.Send(command));
    }
}
