using System.Security.Claims;
using API.DTOs;
using Application.Commands.Reviews;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ReviewController : BaseApiController
    {
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User is not authenticated.");
            return HandleAppResult(await Mediator.Send(new CreateReviewCommand { ProductId = reviewDto.ProductId, UserId = userId, Comment = reviewDto.Comment, Rating = reviewDto.Rating }));
        }
    }
}
