using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace Application.Queries.Addresses;

public class GetAddressByIdHandler : IRequestHandler<GetAddressByIdQuery, AppResult<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IMapper _mapper;
    public GetAddressByIdHandler(IMapper mapper, IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<AddressDto>> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
    {
        var address = await _addressRepository.GetAddressByIdAsync(request.AddressId, cancellationToken);
        if (address == null) return AppResult<AddressDto>.Failure("Address not found", 404);
        return AppResult<AddressDto>.Success(_mapper.Map<AddressDto>(address));
    }
}
