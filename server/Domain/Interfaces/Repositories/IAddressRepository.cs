using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IAddressRepository
{
    Task<Address> CreateAddressAsync(string userId, CancellationToken cancellationToken);
}
