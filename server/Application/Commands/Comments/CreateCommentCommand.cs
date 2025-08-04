using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Comments;

public class CreateCommentCommand : IRequest<AppResult<CommentDto>>
{
    public required string ProductId { get; set; } = string.Empty;
    public required string UserId { get; set; } = string.Empty;
    public required string Content { get; set; } = string.Empty;
    public string? ParentCommentId { get; set; } = null;
}
