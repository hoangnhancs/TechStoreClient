using System.Security.Claims;
using API.DTOs;
using API.SignalR;
using Application.Commands.Reviews;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    
    public class ReviewController : BaseApiController
    {
        private readonly IHubContext<ReviewHub> _hubContext;

        public ReviewController(IHubContext<ReviewHub> hubContext)
        {
            _hubContext = hubContext;
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User is not authenticated.");

            // var result =  HandleAppResult(await Mediator.Send(new CreateReviewCommand { ProductId = reviewDto.ProductId, UserId = userId, Comment = reviewDto.Comment, Rating = reviewDto.Rating }));
            var result = await Mediator.Send(new CreateReviewCommand
            {
                ProductId = reviewDto.ProductId,
                UserId = userId,
                Comment = reviewDto.Comment,
                Rating = reviewDto.Rating
            });

            if (result.IsSuccess && result.Value != null)
            {
                await _hubContext.Clients.Group(reviewDto.ProductId).SendAsync("ReceiveReview", result.Value);
                var request = HttpContext.Request;
                var fullUrl = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
                Console.WriteLine("Send from url: " + fullUrl);
            }
            return HandleAppResult(result);
        }
    }
}
