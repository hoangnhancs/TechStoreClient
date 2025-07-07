using System;
using Application.Core;
using MediatR;

namespace Application.Command.Address;

public class DeleteAddressCommand : IRequest<Result<Unit>>
{
    public required string AddressId { get; set; }
    public required string UserId { get; set; }
}
