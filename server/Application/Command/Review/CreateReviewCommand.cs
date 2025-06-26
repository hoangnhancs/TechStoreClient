using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Command.Review;

public class CreateReviewCommand : IRequest<Result<ReviewDto>>
{
    public required string UserId { get; set; }
    public required string ProductId { get; set; }
    public required string Comment { get; set; }
    public required int Rating { get; set; }
}
