using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Addresses;

public class GetAddressesByUserIdQuery : IRequest<AppResult<List<AddressDto>>>
{
    public required string UserId { get; set; } = null!;
}

