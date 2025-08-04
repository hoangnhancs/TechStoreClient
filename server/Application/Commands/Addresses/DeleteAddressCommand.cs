using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Addresses;

public class DeleteAddressCommand : IRequest<AppResult<Unit>>
{
    public required string AddressId { get; set; }
    public required string UserId { get; set; }
}
