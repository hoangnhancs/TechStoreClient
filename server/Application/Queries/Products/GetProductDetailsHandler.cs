using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Products;

public class GetProductDetailsHandler : IRequestHandler<GetProductDetailsQuery, AppResult<ProductDto>>
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;


    public GetProductDetailsHandler(IMapper mapper, IProductRepository repository)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<AppResult<ProductDto>> Handle(GetProductDetailsQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetProductByIdAsync(request.ProductId, cancellationToken);

        if (product == null)
        {
            return AppResult<ProductDto>.Failure("Product not found", 404);
        }

        return AppResult<ProductDto>.Success(_mapper.Map<ProductDto>(product));
    }
}

