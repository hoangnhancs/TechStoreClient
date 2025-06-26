using API.DTOs;
using Application.Command.Comment;
using Application.Queries.Comment;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    public class CommentController : BaseApiController
    {
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateCommentDto commentDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }
            return HandleResult(await Mediator.Send(new CreateCommentCommand
            {
                ProductId = commentDto.ProductId,
                UserId = userId,
                ParentCommentId = commentDto.ParentCommentId,
                Content = commentDto.Content
            }));
        }
        [HttpGet("comments/{commentId}")]
        public async Task<IActionResult> GetCommentById(string commentId)
        {
            return HandleResult(await Mediator.Send(new GetCommentByIdQuery { CommentId = commentId }));
        }
        [HttpGet("comments")]
        public async Task<IActionResult> GetCommentsByProductId([FromQuery]string productId)
        {
            return HandleResult(await Mediator.Send(new GetListCommentsByProductIdQuery { ProductId = productId }));

        }
    }
}
