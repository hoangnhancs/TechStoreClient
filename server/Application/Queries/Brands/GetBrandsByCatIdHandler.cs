using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Brands;

public class GetBrandsByCatIdHandler : IRequestHandler<GetBrandsByCatIdQuery, List<BrandDto>>
{
    private readonly IBrandRepository _brandRepository;
    private readonly IMapper _mapper;
    public GetBrandsByCatIdHandler(IBrandRepository brandRepository, IMapper mapper)
    {
        _brandRepository = brandRepository;
        _mapper = mapper;
    }
    public async Task<List<BrandDto>> Handle(GetBrandsByCatIdQuery request, CancellationToken cancellationToken)
    {
        var brands = await _brandRepository.GetBrandsByCategory(request.CatId, cancellationToken);
        var brandsDto = _mapper.Map<List<BrandDto>>(brands);
        return brandsDto;
    }
}
