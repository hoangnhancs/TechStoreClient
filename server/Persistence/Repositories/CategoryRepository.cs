using System;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Repositories;

public class CategoryRepository(StoreContext context) : BaseRepository<Category>(context), ICategoryRepository
{

}
