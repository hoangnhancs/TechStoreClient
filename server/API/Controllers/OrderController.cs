using System;
using System.Security.Claims;
using Application.Command.Order;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrderController : BaseApiController
{
    [HttpPost("myorders")]
    public async Task<IActionResult> CreateOrder([FromBody]AddressDto addressDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new CreateOrderCommand { UserId = userId, AddressId = addressDto.Id }));
    }
}
