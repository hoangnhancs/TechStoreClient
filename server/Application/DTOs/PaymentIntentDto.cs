using System;

namespace Application.DTOs;

public class PaymentIntentDto
{
    public required string Id { get; set; }
    public required string ClientSecret { get; set; }
}
