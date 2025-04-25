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
    public static Address MapToEntity(AddressDto addressDto)
    {
        return new Address
        {
            Id = addressDto.Id ?? Guid.NewGuid().ToString(),
            UserId = addressDto.UserId ?? string.Empty,
            FullName = addressDto.FullName ?? string.Empty,
            Line1 = addressDto.Line1 ?? string.Empty,
            Line2 = addressDto.Line2,
            PhoneNumber = addressDto.PhoneNumber,
            City = addressDto.City ?? string.Empty,
            State = addressDto.State ?? string.Empty,
            PostalCode = addressDto.PostalCode ?? string.Empty,
            Country = addressDto.Country ?? string.Empty,
            Type = Enum.TryParse<AddressType>(addressDto.Type, out var type) ? type : AddressType.Both,
            IsDefault = addressDto.IsDefault
        };
    }
}

