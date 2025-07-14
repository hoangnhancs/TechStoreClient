using System;
using Domain.Entities;

namespace Domain.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetCategories();
}
