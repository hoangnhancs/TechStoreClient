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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateAddressHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AppResult<AddressDto>> Handle(UpdateAddressCommand request, CancellationToken cancellationToken)
    {
        if (request.Address.IsDefault == true)
        {
            await _unitOfWork.Addresses.SetOtherAddressNotDefaultAsync(request.UserId, cancellationToken);
        }
        var addressEntity = _mapper.Map<Address>(request.Address);
        addressEntity.Id = request.AddressId;
        _unitOfWork.Addresses.Update(addressEntity);
        await _unitOfWork.CommitAsync(cancellationToken);
        return AppResult<AddressDto>.Success(_mapper.Map<AddressDto>(addressEntity));
    }

}
