using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IFilterTagRepository
{
    Task<List<FilterTag>> GetListFilterTagByCategoryId(int categoryId, CancellationToken cancellationToken);
    Task<List<FilterTag>> GetAllFilterTags(CancellationToken cancellationToken);
}
