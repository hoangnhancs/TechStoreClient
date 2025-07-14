using Application.Queries.Category;
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
            return HandleResult(await Mediator.Send(new GetListCategoriesQuery()));
        }
    }
}
