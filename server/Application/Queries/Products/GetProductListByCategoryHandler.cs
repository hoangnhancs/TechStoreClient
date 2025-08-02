using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Products;

public class GetProductListByCategoryHandler : IRequestHandler<GetProductListByCategoryQuery, AppResult<List<ProductDto>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    public GetProductListByCategoryHandler(IMapper mapper, IProductRepository productRepository)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<AppResult<List<ProductDto>>> Handle(GetProductListByCategoryQuery request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetProductsByCategory(request.CategoryId, cancellationToken);
        if (products == null || products.Count == 0)
        {
            return AppResult<List<ProductDto>>.Failure("No products found for the specified category.", 404);
        }
        var productsDto = products.Select(_mapper.Map<ProductDto>).ToList();
        return AppResult<List<ProductDto>>.Success(productsDto);
    }
}
