using System;

namespace API.DTOs;

public class CreateReviewDto
{
    public required string ProductId { get; set; }
    public required string Comment { get; set; }
    public required int Rating { get; set; }
}
