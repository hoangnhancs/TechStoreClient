using System;
using System.Security.Claims;
using Application.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security;

public class UserAccessor(IHttpContextAccessor httpContextAccessor, StoreContext context) : IUserAccessor
{
    public async Task<User> GetUserAsync()
    {
        return await context.Users
            .Include(u => u.Image)
            .FirstOrDefaultAsync(u => u.Id == GetUserId()) ?? throw new UnauthorizedAccessException("User not found");
    }

    public string GetUserId()
    {
        return httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("No user found");
    }
}
