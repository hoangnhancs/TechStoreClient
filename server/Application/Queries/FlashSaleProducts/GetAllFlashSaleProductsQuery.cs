using System;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FlashSaleProducts;

public class GetAllFlashSaleProductsQuery : IRequest<List<FlashSaleProductDto>>
{
    
}
