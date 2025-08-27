using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class InfoController : BaseApiController
    {
        private readonly string _instanceId = Guid.NewGuid().ToString();

        [HttpGet("instance")]
        public IActionResult GetInstance() => Ok(new
        {
            Machine = Environment.MachineName,
            InstanceId = _instanceId
        });
    }
}
