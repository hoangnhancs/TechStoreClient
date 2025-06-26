using Application.Queries.FilterTag;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FilterTagController : BaseApiController
    {
        [HttpGet("filtertags")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFilterTags([FromQuery] int catId)
        {
            return HandleResult(await Mediator.Send(new GetListFilterTagByCategoryQuery
            {
                CategoryId = catId
            }));
        }
    }
}
