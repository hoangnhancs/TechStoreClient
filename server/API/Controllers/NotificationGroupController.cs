using Application.Queries.NotificationGroup;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class NotificationGroupController : BaseApiController
    {
        [HttpGet("admin-group")]
        [Authorize(Policy = "SecurityStampRequirement")]
        public async Task<IActionResult> GetAdminNotificationGroup()
        {
            return HandleAppResult(await Mediator.Send(new GetAdminNotificationGroupQuery()));
        }
    }
}
