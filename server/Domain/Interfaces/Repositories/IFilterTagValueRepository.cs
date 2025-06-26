using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface IFilterTagValueRepository 
{
    Task<List<FilterTagValue>> GetListFilterTagValueByCategoryId(int categoryId, CancellationToken cancellationToken);
}
