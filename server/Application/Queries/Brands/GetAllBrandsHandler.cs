using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Brands;

public class GetAllBrandsHandler : IRequestHandler<GetAllBrandsQuery, List<BrandDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public GetAllBrandsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<List<BrandDto>> Handle(GetAllBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _unitOfWork.Brands.GetAllAsync(cancellationToken);
        var brandsDto = _mapper.Map<List<BrandDto>>(brands);
        return brandsDto;
    }
}
