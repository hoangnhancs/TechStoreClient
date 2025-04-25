using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class AddressRepository(StoreContext context) : IAddressRepository
{
    private readonly StoreContext _context = context;
    public Task<Address> CreateAddressAsync(string userId, Address address, CancellationToken cancellationToken)
    {

        var newAddress = new Address
        {
            UserId = userId,
            FullName = address.FullName,
            PhoneNumber = address.PhoneNumber,
            Line1 = address.Line1,
            Line2 = address.Line2,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country,
            Type = AddressType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDefault = address.IsDefault,
        };

        _context.Addresses.Add(newAddress);

        return Task.FromResult(newAddress);
    }

    public async Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Addresses
            .Where(a => a.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task SetOtherAddressNotDefaultAsync(string userId, CancellationToken cancellationToken)
    {
        var addressesDefault = await _context.Addresses
            .Where(a => a.UserId == userId && a.IsDefault)
            .FirstOrDefaultAsync(cancellationToken);

        if (addressesDefault != null)
        {
            addressesDefault.IsDefault = false;
        }

    }
}
