using System;
using Application.Core;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Addresses;

public class DeleteAddressHandler : IRequestHandler<DeleteAddressCommand, AppResult<Unit>>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IUnitOfWork _unitOfWork;
    public DeleteAddressHandler(IAddressRepository addressRepository, IUnitOfWork unitOfWork)
    {
        _addressRepository = addressRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<Unit>> Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        await _addressRepository.DeleteAddressAsync(request.AddressId, request.UserId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return AppResult<Unit>.Success(Unit.Value);
    }
}
