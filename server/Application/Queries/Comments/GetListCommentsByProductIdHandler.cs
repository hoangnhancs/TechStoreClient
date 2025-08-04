using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Comments;

public class GetListCommentsByProductIdHandler : IRequestHandler<GetListCommentsByProductIdQuery, AppResult<List<CommentDto>>>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IMapper _mapper;
    public GetListCommentsByProductIdHandler(ICommentRepository commentRepository, IMapper mapper)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<CommentDto>>> Handle(GetListCommentsByProductIdQuery request, CancellationToken cancellationToken)
    {
        var comments = await _commentRepository.GetCommentsByProductId(request.ProductId, cancellationToken);
        if (comments == null || comments.Count == 0)
        {
            return AppResult<List<CommentDto>>.Failure("No comments found for this product.", 404);
        }

        var rootComments = comments.Where(c => c.ParentCommentId == null).ToList();
        //chi tra ve nhung comment cha, vi trong comment cha da include comment con roi
        //neu khong loc thi no se tra ve tat ca cac comment, bao gom nhung comment con chua nhung comment con khac
        var commentsDto = rootComments.Select(_mapper.Map<CommentDto>).ToList();
        return AppResult<List<CommentDto>>.Success(commentsDto);
    }
}
