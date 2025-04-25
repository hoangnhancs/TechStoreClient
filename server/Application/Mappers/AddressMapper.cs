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
            Province = address.Province,
            District = address.District,
            Ward = address.Ward,
            DetailAddress = address.DetailAddress,
            PhoneNumber = address.PhoneNumber,
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
            Province = addressDto.Province ?? string.Empty,
            District = addressDto.District,
            Ward = addressDto.Ward ?? string.Empty,
            DetailAddress = addressDto.DetailAddress ?? string.Empty,
            PhoneNumber = addressDto.PhoneNumber,
            Type = Enum.TryParse<AddressType>(addressDto.Type, out var type) ? type : AddressType.Both,
            IsDefault = addressDto.IsDefault
        };
    }
}

