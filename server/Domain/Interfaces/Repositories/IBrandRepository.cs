using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IBrandRepository
{
    Task<List<Brand>> GetAllBrands(CancellationToken cancellationToken);
    Task<List<Brand>> GetBrandsByCategory(int categoryId, CancellationToken cancellationToken);
}
