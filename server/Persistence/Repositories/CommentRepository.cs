using System;
using System.Linq;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class CommentRepository(StoreContext context) : ICommentRepository
{
    private readonly StoreContext _context = context;
    public async Task<Comment> CreateComment(Comment comment, CancellationToken cancellationToken)
    {
        await _context.Comments.AddAsync(comment, cancellationToken);
        return comment;
    }

    public async Task<bool> DeleteComment(string commentId, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);
        if (comment == null)
        {
            return false;
        }
        var childComments = await GetAllChildCommentsRecursively(commentId, cancellationToken);
        var deleteComments = new List<Comment> { comment };
        deleteComments.AddRange(childComments);
        await _context.Comments.Where(c => c.Id == commentId).ExecuteDeleteAsync(cancellationToken);
        return true;
    }

    public async Task<List<Comment>> GetAllChildCommentsRecursively(string parentId, CancellationToken cancellationToken)
    {
        var result = new List<Comment>();      
        var comments = await _context.Comments
            .Where(c => c.ParentCommentId == parentId)
            .ToListAsync(cancellationToken);
        result.AddRange(comments);
        foreach (var comment in comments)
        {
            var childComments = await GetAllChildCommentsRecursively(comment.Id, cancellationToken);
            result.AddRange(childComments);
        }
        return result;
    }

    public async Task<Comment?> GetCommentById(string commentId, CancellationToken cancellationToken)
    {
        return await _context.Comments
            .Where(c => c.Id == commentId && c.IsVisible)
            .Include(c => c.User)
            .Include(c => c.Product)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<List<Comment>> GetCommentsByProductId(string productId, CancellationToken cancellationToken)
    {
        return await _context.Comments
            .Where(c => c.ProductId == productId && c.IsVisible)
            .Include(c => c.User)
            .ThenInclude(c => c!.Image)
            .Include(c => c.Replies)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Comment>> GetCommentsByUserId(string userId, CancellationToken cancellationToken)
    {
        return await _context.Comments
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .Include(c => c.User)
            .ToListAsync(cancellationToken);
    }

    public async Task<Comment> UpdateComment(Comment comment, CancellationToken cancellationToken)
    {
        var existingComment = await _context.Comments.Where(c => c.Id == comment.Id).FirstOrDefaultAsync();
        if (existingComment == null)
        {
            throw new InvalidOperationException($"Comment with ID {comment.Id} not found.");
        }
        existingComment.Content = comment.Content;
        existingComment.UpdatedAt = DateTime.UtcNow;
        existingComment.IsEdited = true;
        _context.Comments.Update(existingComment);
        return existingComment;
    }
}
