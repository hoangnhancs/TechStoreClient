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
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> GetOrderByUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new GetOrderByUserIdQuery { UserId = userId }));
    }

    [HttpPost("createorder")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrUpdateOrderDto orderDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new CreateOrUpdateOrderCommand { UserId = userId, CreateOrderDto = orderDto }));
    }

    [HttpGet("myorders/{orderId}")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> GetOrderDetailsByOrderId(string orderId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new GetOrderDetailsByOrderIdQuery { OrderId = orderId }));
    }
}
