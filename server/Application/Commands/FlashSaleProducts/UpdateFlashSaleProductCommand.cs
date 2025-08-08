using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.FlashSaleProducts;

public class UpdateFlashSaleProductCommand : IRequest<AppResult<FlashSaleProductDto>>
{
    public required FlashSaleProductDto FlashSaleProduct { get; set; }
}
