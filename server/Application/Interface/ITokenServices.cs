using System;
using Application.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Interface;

public interface ITokenServices
{
    Task<AccessTokenResult> CreateAccessTokenAsync(User user);
    RefreshToken CreateRefreshToken(User user, string ipAddress);
}
