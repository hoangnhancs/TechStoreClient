using System;
using Application.Core;
using Application.DTOs;
using Application.Mappers;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Address;

public class UpdateAddressHandler : IRequestHandler<UpdateAddressCommand, Result<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateAddressHandler(IAddressRepository addressRepository, IUnitOfWork unitOfWork)
    {
        _addressRepository = addressRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AddressDto>> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Address.IsDefault == true)
        {
            await _addressRepository.SetOtherAddressNotDefaultAsync(request.UserId, cancellationToken);
        }
        var addressEntity = AddressMapper.MapToEntity(request.Address);
        var address = await _addressRepository.UpdateAddressAsync(request.AddressId, addressEntity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<AddressDto>.Success(AddressMapper.MapToDto(address));
    }

}
