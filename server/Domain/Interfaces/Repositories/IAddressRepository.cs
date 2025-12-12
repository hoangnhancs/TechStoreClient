using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IAddressRepository : IBaseRepository<Address>
{
    // Task<Address> CreateAddressAsync(string userId, Address address, CancellationToken cancellationToken);
    // Task<Address> UpdateAddressAsync(string addressId, Address address, CancellationToken cancellationToken);
    Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken);
    // Task<Address> GetAddressByIdAsync(string addressId, CancellationToken cancellationToken);
    Task SetOtherAddressNotDefaultAsync(string userId, CancellationToken cancellationToken);
    Task DeleteAddressAsync(string addressId, string userId, CancellationToken cancellationToken);
    Task<Address?> GetDefaultAddressAsync(string userId, CancellationToken cancellationToken);
}
