using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Brands;

public class GetBrandsByCatIdQuery : IRequest<List<BrandDto>>
{
    public int CatId { get; set; }
}
