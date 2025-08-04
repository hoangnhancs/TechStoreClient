using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>()
            ?? throw new InvalidOperationException("Imediator service is unavailable");

        protected ActionResult HandleAppResult<T>(AppResult<T> result)
        {
            if (!result.IsSuccess && result.Code == 404) return NotFound(result.Error); // Trả về lỗi 404 nấu không tồn tại
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            return BadRequest(result.Error);
        }
    }
}
