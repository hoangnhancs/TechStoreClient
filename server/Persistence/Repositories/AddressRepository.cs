using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Persistence.Repositories;

public class AddressRepository(StoreContext context) : IAddressRepository
{
    private readonly StoreContext _context = context;
    public Task<Address> CreateAddressAsync(string userId, CancellationToken cancellationToken)
    {
        var address = new Address
        {
            UserId = userId,
            FullName = "Default Name", 
            PhoneNumber = "0000000000", 
            Line1 = "Default Line 1", 
            Line2 = "Default Line 2", 
            City = "Default City",     
            State = "Default State",   
            PostalCode = "00000",         
            Country = "Default Country", 
            Type = AddressType.Both, 
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };


        _context.Addresses.Add(address);

        return Task.FromResult(address);
    }
}
