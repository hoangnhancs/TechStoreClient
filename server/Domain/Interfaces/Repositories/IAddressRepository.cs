using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IAddressRepository
{
    Task<Address> CreateAddressAsync(string userId, Address address, CancellationToken cancellationToken);
    Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task SetOtherAddressNotDefaultAsync(string userId, CancellationToken cancellationToken);
}
