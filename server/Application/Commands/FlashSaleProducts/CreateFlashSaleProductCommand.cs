using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.FlashSaleProducts;

public class CreateFlashSaleProductCommand : IRequest<AppResult<FlashSaleProductDto>>
{
    public required FlashSaleProductDto FlashSaleProduct { get; init; }
}
