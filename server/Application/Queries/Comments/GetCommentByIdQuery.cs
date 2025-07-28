using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Comments;

public class GetCommentByIdQuery : IRequest<Result<CommentDto>>
{
    public required string CommentId { get; set; }
}
