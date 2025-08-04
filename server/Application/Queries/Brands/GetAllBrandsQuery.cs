using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Brands;

public class GetAllBrandsQuery : IRequest<List<BrandDto>>
{

}
