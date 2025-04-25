using System;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Application.Command.Payment;
using Microsoft.AspNetCore.Authorization;
using Application.Queries.Payment;

namespace API.Controllers;

[Authorize]
public class PaymentsController : BaseApiController
{
    [HttpPost("create-payment-intent")]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new CreateOrUpdatePaymentIntentCommand { UserId = userId }));
    }
    [HttpGet("mypayments")]
    public async Task<ActionResult<BasketDto>> GetPaymentByUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleResult(await Mediator.Send(new GetPaymentByUserIdQuery { UserId = userId }));
    }
}
