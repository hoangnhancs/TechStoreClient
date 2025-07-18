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
            Province = address.Province,
            District = address.District,
            Ward = address.Ward,
            DetailAddress = address.DetailAddress,
            Type = AddressType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsDefault = address.IsDefault,
        };

        _context.Addresses.Add(newAddress);

        return Task.FromResult(newAddress);
    }

    public async Task<Address> UpdateAddressAsync(string addressId, Address address, CancellationToken cancellationToken)
    {
        var currentAddress = await _context.Addresses
            .Where(a => a.Id == addressId && !a.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (currentAddress != null)
        {
            currentAddress.FullName = address.FullName;
            currentAddress.Province = address.Province;
            currentAddress.District = address.District;
            currentAddress.Ward = address.Ward;
            currentAddress.DetailAddress = address.DetailAddress;
            currentAddress.PhoneNumber = address.PhoneNumber;
            currentAddress.Type = address.Type;
            currentAddress.IsDefault = address.IsDefault;
            currentAddress.UpdatedAt = DateTime.UtcNow;
            _context.Addresses.Update(currentAddress);
            
        }
        return currentAddress ?? throw new Exception("Address not found");
    }
    public async Task<List<Address>> GetAddressesByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Addresses
            .Where(a => a.UserId == userId && !a.IsDeleted)
            .ToListAsync(cancellationToken);
    }

    public async Task SetOtherAddressNotDefaultAsync(string userId, CancellationToken cancellationToken)
    {
        var addressesDefault = await _context.Addresses
            .Where(a => a.UserId == userId && a.IsDefault && !a.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (addressesDefault != null)
        {
            addressesDefault.IsDefault = false;
        }

    }

    public async Task<Address> GetAddressByIdAsync(string addressId, CancellationToken cancellationToken)
    {
        return await _context.Addresses
            .Where(a => a.Id == addressId && !a.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken) ?? throw new Exception("Address not found");
    }

    public async Task DeleteAddressAsync(string addressId, string userId, CancellationToken cancellationToken)
    {
        var address = await _context.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId, cancellationToken);
        if (address == null)
        {
            throw new Exception("Address not found");
        }
        address.IsDeleted = true;  
    }
}
