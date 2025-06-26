using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Comment;

public class GetListCommentsByProductIdQuery : IRequest<Result<List<CommentDto>>>
{
    public required string ProductId { get; set; }
}
