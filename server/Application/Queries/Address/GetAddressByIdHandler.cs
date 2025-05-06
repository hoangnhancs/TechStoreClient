using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace Application.Queries.Address;

public class GetAddressByIdHandler : IRequestHandler<GetAddressByIdQuery, Result<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;
    public GetAddressByIdHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }
    public async Task<Result<AddressDto>> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
    {
        var address = await _addressRepository.GetAddressByIdAsync(request.AddressId, cancellationToken);
        if (address == null) return Result<AddressDto>.Failure("Address not found", 404);
        return Result<AddressDto>.Success(AddressMapper.MapToDto(address));
    }
}
