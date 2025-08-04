using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries.Products;

public class GetProductListHandler : IRequestHandler<GetProductListQuery, AppResult<List<ProductDto>>>
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;

    public GetProductListHandler(IMapper mapper, IProductRepository repository)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<AppResult<List<ProductDto>>> Handle(GetProductListQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllProducts(cancellationToken);

        var productsDto = products.Select(_mapper.Map<ProductDto>).ToList();

        if (productsDto == null || productsDto.Count == 0)
        {
            return AppResult<List<ProductDto>>.Failure("No products found", 404);
        }
        else
        {
            return AppResult<List<ProductDto>>.Success(productsDto);
        }
    }
}