using System;
using Application.DTOs;
using Application.Queries.Brands;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace API.GraphQL.Queries;

[ExtendObjectType("Query")]
public class BrandQuery
{
    [GraphQLName("getBrandsByCategoryId")]
    public async Task<List<BrandDto>> GetBrandsByCategoryId([Service] IMediator _mediator, int categoryId)
    {

        return await _mediator.Send(new GetBrandsByCatIdQuery { CatId = categoryId });
    }
    [GraphQLName("getAllBrands")]
    public async Task<List<BrandDto>> GetAllBrands([Service] IMediator _mediator)
    {
        return await _mediator.Send(new GetAllBrandsQuery());
    }
}
