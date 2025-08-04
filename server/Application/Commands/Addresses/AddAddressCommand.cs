using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Addresses;

public class AddAddressCommand : IRequest<AppResult<AddressDto>>
{
    public required string UserId { get; set; }
    public AddressDto Address { get; set; } = null!;
}
