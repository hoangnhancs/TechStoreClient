using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Products;

public class GetProductDetailsHandler : IRequestHandler<GetProductDetailsQuery, Result<ProductDto>>
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;


    public GetProductDetailsHandler(IMapper mapper, IProductRepository repository)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<ProductDto>> Handle(GetProductDetailsQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null)
        {
            return Result<ProductDto>.Failure("Product not found", 404);
        }

        return Result<ProductDto>.Success(_mapper.Map<ProductDto>(product));
    }
}

