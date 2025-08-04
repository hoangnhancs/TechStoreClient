using Application.Queries.Categories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoryController : BaseApiController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetListCategories()
        {
            return HandleAppResult(await Mediator.Send(new GetListCategoriesQuery()));
        }
    }
}
