using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Comment;

public class GetCommentByIdHandler : IRequestHandler<GetCommentByIdQuery, Result<CommentDto>>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IMapper _mapper;
    public GetCommentByIdHandler(ICommentRepository commentRepository, IMapper mapper)
    {
        _commentRepository = commentRepository ?? throw new ArgumentNullException(nameof(commentRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }
    public async Task<Result<CommentDto>> Handle(GetCommentByIdQuery request, CancellationToken cancellationToken)
    {
        var comment = await _commentRepository.GetCommentById(request.CommentId, cancellationToken);
        if (comment == null)
        {
            return Result<CommentDto>.Failure("Comment not found", 404);
        }
        var commentDto = _mapper.Map<CommentDto>(comment);
        return Result<CommentDto>.Success(commentDto);
    }
}
