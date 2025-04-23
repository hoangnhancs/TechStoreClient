using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Address;

public class AddAddressHandler : IRequestHandler<AddAddressCommand, Result<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IUnitOfWork _unitOfWork;
    public AddAddressHandler(IAddressRepository addressRepository, IUnitOfWork unitOfWork)
    {
        _addressRepository = addressRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<Result<AddressDto>> Handle(AddAddressCommand request, CancellationToken cancellationToken)
    {
        var address = await _addressRepository.CreateAddressAsync(request.UserId, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return Result<AddressDto>.Failure("Problem when create address", 400);
        return Result<AddressDto>.Success(AddressMapper.MapToDto(address));
    }
}
