using System.Security.Claims;
using Application.Commands.Images;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    public class PhotoController : BaseApiController
    {
        [HttpPut("update-photo")]
        public async Task<IActionResult> UpdateImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            return HandleResult(await Mediator.Send(new UpdateUserImageCommand { UserId = userId, NewImage = file }));
            
        }
    }
}
