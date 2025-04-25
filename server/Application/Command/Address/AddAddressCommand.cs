using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Command.Address;

public class AddAddressCommand : IRequest<Result<AddressDto>>
{
    public required string UserId { get; set; }
    public AddressDto Address { get; set; } = null!;
}
