using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Commands.Addresses;

public class UpdateAddressCommand : IRequest<Result<AddressDto>>
{
    public required string UserId { get; set; }
    public required string AddressId { get; set; }
    public required AddressDto Address { get; set; }
}
