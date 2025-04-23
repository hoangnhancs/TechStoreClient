using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries.Products;

public class GetProductListHandler : IRequestHandler<GetProductListQuery, Result<List<ProductDto>>>
{
    private readonly IProductRepository _repository;

    public GetProductListHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<List<ProductDto>>> Handle(GetProductListQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllProductsAsync(cancellationToken);

        var productsDto = products.Select(ProductMapper.MapToDto).ToList();

        if (productsDto == null || productsDto.Count == 0)
        {
            return Result<List<ProductDto>>.Failure("No products found", 404);
        }
        else
        {
            return Result<List<ProductDto>>.Success(productsDto);
        }
    }
}