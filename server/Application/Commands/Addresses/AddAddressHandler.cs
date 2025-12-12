using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;


namespace Application.Commands.Addresses;

public class AddAddressHandler : IRequestHandler<AddAddressCommand, AppResult<AddressDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public AddAddressHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    public async Task<AppResult<AddressDto>> Handle(AddAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Address.IsDefault == true)
        {
            await _unitOfWork.Addresses.SetOtherAddressNotDefaultAsync(request.UserId, cancellationToken);
        }
        var addressEntity = _mapper.Map<Address>(request.Address);
        addressEntity.UserId = request.UserId;
        await _unitOfWork.Addresses.AddAsync(addressEntity, cancellationToken);
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result) return AppResult<AddressDto>.Failure("Problem when create address", 400);
        return AppResult<AddressDto>.Success(_mapper.Map<AddressDto>(addressEntity));
    }
}
