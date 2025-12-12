using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IBrandRepository : IBaseRepository<Brand>
{
    Task<List<Brand>> GetBrandsByCategory(int categoryId, CancellationToken cancellationToken);
}
