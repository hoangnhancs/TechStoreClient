using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class RedisController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisController(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        // Endpoint để publish message
        [HttpPost("publish")]
        [AllowAnonymous]
        public async Task<IActionResult> Publish([FromQuery] string message)
        {
            var pub = _redis.GetSubscriber();
            await pub.PublishAsync("demo-channel", message);
            return Ok(new { status = "Published", message });
        }

        // Endpoint để subscribe (chỉ để test, không trả về realtime mà log ra console)
        [HttpGet("subscribe")]
        [AllowAnonymous]
        public IActionResult Subscribe()
        {
            var sub = _redis.GetSubscriber();
            sub.Subscribe("demo-channel", (channel, value) =>
            {
                Console.WriteLine($"[SUB] Received: {value}");
            });

            return Ok("Subscribed to demo-channel. Check logs for messages.");
        }
    }
}
