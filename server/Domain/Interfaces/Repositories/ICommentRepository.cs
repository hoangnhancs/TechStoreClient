using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface ICommentRepository
{
    Task<Comment?> GetCommentById(string commentId, CancellationToken cancellationToken);
    Task<List<Comment>> GetCommentsByProductId(string productId, CancellationToken cancellationToken);
    Task<List<Comment>> GetAllChildCommentsRecursively(string parentId, CancellationToken cancellationToken);
    Task<Comment> CreateComment(Comment comment, CancellationToken cancellationToken);
    Task<Comment> UpdateComment(Comment comment, CancellationToken cancellationToken);
    Task<bool> DeleteComment(string commentId, CancellationToken cancellationToken);
    Task<List<Comment>> GetCommentsByUserId(string userId, CancellationToken cancellationToken);
}
