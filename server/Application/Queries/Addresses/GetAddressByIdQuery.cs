using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Addresses;

public class GetAddressByIdQuery : IRequest<AppResult<AddressDto>>
{
    public required string AddressId { get; set; } 
}
