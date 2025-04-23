using System;
using System.Security.Claims;
using Application.Command.Address;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class AddressController : BaseApiController
{
    [HttpPost("myaddresses")]
    public async Task<IActionResult> CreateAddress()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");
        return HandleResult(await Mediator.Send(new AddAddressCommand { UserId = userId }));
    }
}
