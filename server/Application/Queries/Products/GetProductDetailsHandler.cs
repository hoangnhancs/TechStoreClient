using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Products;

public class GetProductDetailsHandler : IRequestHandler<GetProductDetailsQuery, Result<ProductDto>>
{
    private readonly IProductRepository _repository;

    public GetProductDetailsHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<ProductDto>> Handle(GetProductDetailsQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null)
        {
            return Result<ProductDto>.Failure("Product not found", 404);
        }

        return Result<ProductDto>.Success(ProductMapper.MapToDto(product));
    }
}

