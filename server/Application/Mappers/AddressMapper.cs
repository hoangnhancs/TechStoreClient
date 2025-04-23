using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class AddressMapper
{
    public static AddressDto MapToDto(Address address)
    {
        return new AddressDto
        {
            Id = address.Id,
            UserId = address.UserId,
            FullName = address.FullName,
            Line1 = address.Line1,
            Line2 = address.Line2,
            PhoneNumber = address.PhoneNumber,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country,
            Type = address.Type.ToString(),
            IsDefault = address.IsDefault
        };
    }
}

