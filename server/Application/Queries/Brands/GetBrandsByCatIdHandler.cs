using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Brands;

public class GetBrandsByCatIdHandler : IRequestHandler<GetBrandsByCatIdQuery, List<BrandDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public GetBrandsByCatIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<List<BrandDto>> Handle(GetBrandsByCatIdQuery request, CancellationToken cancellationToken)
    {
        var brands = await _unitOfWork.Brands.GetBrandsByCategory(request.CatId, cancellationToken);
        var brandsDto = _mapper.Map<List<BrandDto>>(brands);
        return brandsDto;
    }
}
