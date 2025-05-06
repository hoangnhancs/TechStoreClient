using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Address;

public class GetAddressByIdQuery : IRequest<Result<AddressDto>>
{
    public required string AddressId { get; set; } 
}
