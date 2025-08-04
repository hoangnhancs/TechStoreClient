using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Products;

public class GetTop10ProductPerCategoryHandler : IRequestHandler<GetTop10ProductPerCategoryQuery, AppResult<List<ProductDto>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    public GetTop10ProductPerCategoryHandler(IMapper mapper, IProductRepository productRepository)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<ProductDto>>> Handle(GetTop10ProductPerCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetTop10ProductPerCategory(cancellationToken);
        var productDtos = products.Select(_mapper.Map<ProductDto>).ToList();
        return AppResult<List<ProductDto>>.Success(productDtos);
    }
}
