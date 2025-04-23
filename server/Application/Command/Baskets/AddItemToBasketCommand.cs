using System;
using System.Text.Json.Serialization;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using MediatR;

namespace Application.Command.Baskets;

public class AddItemToBasketCommand : IRequest<Result<BasketDto>>
{
    [JsonIgnore] 
    public string? UserId { get; set; }
    public required string ProductId { get; set; }
    public required int Quantity { get; set; }
}
