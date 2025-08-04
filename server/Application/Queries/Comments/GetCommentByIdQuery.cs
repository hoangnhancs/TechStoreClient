using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Comments;

public class GetCommentByIdQuery : IRequest<AppResult<CommentDto>>
{
    public required string CommentId { get; set; }
}
