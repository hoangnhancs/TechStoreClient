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

public class UpdateAddressHandler : IRequestHandler<UpdateAddressCommand, AppResult<AddressDto>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateAddressHandler(IAddressRepository addressRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _addressRepository = addressRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AppResult<AddressDto>> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Address.IsDefault == true)
        {
            await _addressRepository.SetOtherAddressNotDefaultAsync(request.UserId, cancellationToken);
        }
        var addressEntity = _mapper.Map<Address>(request.Address);
        var address = await _addressRepository.UpdateAddressAsync(request.AddressId, addressEntity, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);
        return AppResult<AddressDto>.Success(_mapper.Map<AddressDto>(address));
    }

}
