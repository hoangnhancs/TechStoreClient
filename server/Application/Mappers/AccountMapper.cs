using System;
using Application.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Mappers;

public class AccountMapper
{ 
    public static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName ?? string.Empty,
            ImageUrl = user.ImageUrl ?? string.Empty,
            TotalSpent = user.TotalSpent
        };
    }
}
