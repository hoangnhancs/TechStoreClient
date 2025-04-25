using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Address;

public class GetAddressesByUserIdHandler : IRequestHandler<GetAddressesByUserIdQuery, Result<List<AddressDto>>>
{
    private readonly IAddressRepository _addressRepository;

    public GetAddressesByUserIdHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<Result<List<AddressDto>>> Handle(GetAddressesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _addressRepository.GetAddressesByUserIdAsync(request.UserId, cancellationToken);
        if (addresses == null || addresses.Count == 0)
        {
            return Result<List<AddressDto>>.Success([]);
        }
        return Result<List<AddressDto>>.Success(addresses.Select(AddressMapper.MapToDto).ToList());
    }
}
