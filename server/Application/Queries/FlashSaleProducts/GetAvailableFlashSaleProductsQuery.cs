using System;
using Application.DTOs;
using MediatR;

namespace Application.Queries.FlashSaleProducts;

public class GetAvailableFlashSaleProductsQuery : IRequest<List<FlashSaleProductDto>>
{

}
