using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Comments;

public class CreateCommentHandler : IRequestHandler<CreateCommentCommand, Result<CommentDto>>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    public CreateCommentHandler(IAccountRepository accountRepository, ICommentRepository commentRepository, IMapper mapper, IUnitOfWork unitOfWork)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _accountRepository = accountRepository;
    }

    public async Task<Result<CommentDto>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var userInfor = await _accountRepository.GetUserByIdAsync(request.UserId, cancellationToken);
        var comment = new Domain.Entities.Comment
        {
            ProductId = request.ProductId,
            UserId = request.UserId,
            User =  userInfor,
            Content = request.Content,
            ParentCommentId = request.ParentCommentId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        var createdComment = await _commentRepository.CreateComment(comment, cancellationToken);
        if (createdComment == null)
        {
            return Result<CommentDto>.Failure("Failed to create comment.", 500);
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<CommentDto>.Success(_mapper.Map<CommentDto>(createdComment));
    }
}
