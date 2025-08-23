using System;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Commands.Payments;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

public class PaymentsController : BaseApiController
{
    [HttpPost("create-payment-intent")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> CreateOrUpdatePaymentIntent()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleAppResult(await Mediator.Send(new CreateOrUpdatePaymentIntentCommand { UserId = userId }));
    }
    // [HttpGet("mypayments")]
    // [Authorize(Policy = "SecurityStampRequirement")]
    // public async Task<IActionResult> GetPaymentByUserId()
    // {
    //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    //     if (string.IsNullOrEmpty(userId))
    //         return Unauthorized("User not authenticated");

    //     return HandleAppResult(await Mediator.Send(new GetPaymentByUserIdQuery { UserId = userId }));
    // }
    // [HttpGet("payment-intent")]
    // [Authorize(Policy = "SecurityStampRequirement")]
    // public async Task<IActionResult> GetPaymentIntent([FromQuery] string paymentIntentId)
    // {
    //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    //     if (string.IsNullOrEmpty(userId))
    //         return Unauthorized("User not authenticated");

    //     return HandleAppResult(await Mediator.Send(new GetPaymentIntentQuery { PaymentIntentId = paymentIntentId }));
    // }
    [HttpPut("complete-payment")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> CompletePayment()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleAppResult(await Mediator.Send(new UpdateCompletePaymentCommand { UserId = userId }));
    }
    [HttpPost("create-payment")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<IActionResult> CreatePayment()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

        return HandleAppResult(await Mediator.Send(new CreatePaymentCommand { UserId = userId }));
    }
}
