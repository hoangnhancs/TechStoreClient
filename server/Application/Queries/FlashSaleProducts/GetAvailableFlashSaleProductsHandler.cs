using System;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.FlashSaleProducts;

public class GetAvailableFlashSaleProductsHandler : IRequestHandler<GetAvailableFlashSaleProductsQuery, List<FlashSaleProductDto>>
{
    private readonly IMapper _mapper;
    private readonly IFlashSaleProductRepository _flashSaleProductRepository;
    public GetAvailableFlashSaleProductsHandler(IMapper mapper, IFlashSaleProductRepository flashSaleProductRepository)
    {
        _mapper = mapper;
        _flashSaleProductRepository = flashSaleProductRepository;
    }
    public async Task<List<FlashSaleProductDto>> Handle(GetAvailableFlashSaleProductsQuery request, CancellationToken cancellationToken)
    {
        var flashProducts = await _flashSaleProductRepository.GetAvailableFlashSaleProducts(cancellationToken);
        var flashProductsDto = _mapper.Map<List<FlashSaleProductDto>>(flashProducts);
        return flashProductsDto;
    }
}
