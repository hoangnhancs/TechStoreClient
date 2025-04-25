using System;
using System.Security.Claims;
using Application.Command.Order;
using Application.DTOs;
using Application.Queries.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrderController : BaseApiController
{
    [HttpGet("myorders")]
    public async Task<IActionResult> GetOrderByUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new GetOrderByUserIdQuery { UserId = userId }));
    }

    [HttpPost("createorder")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrUpdateOrderDto orderDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new CreateOrUpdateOrderCommand { UserId = userId, CreateOrderDto = orderDto }));
    }
}
