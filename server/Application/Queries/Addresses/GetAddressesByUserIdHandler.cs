using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.Addresses;

public class GetAddressesByUserIdHandler : IRequestHandler<GetAddressesByUserIdQuery, AppResult<List<AddressDto>>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IMapper _mapper;

    public GetAddressesByUserIdHandler(IMapper mapper, IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
        _mapper = mapper;
    }

    public async Task<AppResult<List<AddressDto>>> Handle(GetAddressesByUserIdQuery request, CancellationToken cancellationToken)
    {
        var addresses = await _addressRepository.GetAddressesByUserIdAsync(request.UserId, cancellationToken);
        if (addresses == null || addresses.Count == 0)
        {
            return AppResult<List<AddressDto>>.Success([]);
        }
        return AppResult<List<AddressDto>>.Success(addresses.Select(_mapper.Map<AddressDto>).ToList());
    }
}
