using System;
using Domain.Entities;

namespace Application.Interface;

public interface IUserAccessor
{
    string GetUserId();
    Task<User> GetUserAsync();
}
