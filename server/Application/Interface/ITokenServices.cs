using System;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Application.Interface;

public interface ITokenServices
{
    Task<string> CreateTokenAsync(User user);
}
