using Application.Core;
using Application.DTOs;
using Application.Interface;
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
    private readonly ICacheService _cacheService;

    public GetProductListHandler(IMapper mapper, IProductRepository repository, ICacheService cacheService)
    {
        _repository = repository;
        _mapper = mapper;
        _cacheService = cacheService;
    }

    public async Task<AppResult<List<ProductDto>>> Handle(GetProductListQuery request, CancellationToken cancellationToken)
    {
        var cachedProducts = await _cacheService.GetAsync<List<ProductDto>>("productList");
        if (cachedProducts != null)
        {
            Console.WriteLine("Fetching products from cache.");
            return AppResult<List<ProductDto>>.Success(cachedProducts);
        }
        else
        {
            Console.WriteLine("Fetching products from database.");
        }

        var products = await _repository.GetAllProducts(cancellationToken);

        var productsDto = products.Select(_mapper.Map<ProductDto>).ToList();

        if (productsDto == null || productsDto.Count == 0)
        {
            return AppResult<List<ProductDto>>.Failure("No products found", 404);
        }
        else
        {
            await _cacheService.SetAsync("productList", productsDto, TimeSpan.FromHours(1));
            return AppResult<List<ProductDto>>.Success(productsDto);
        }
    }
}