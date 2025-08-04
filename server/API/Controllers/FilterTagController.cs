using Application.Queries.FilterTags;
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
            return HandleAppResult(await Mediator.Send(new GetListFilterTagByCategoryQuery
            {
                CategoryId = catId
            }));
        }
        [HttpGet("filtertags/all_filter_tags")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllFilterTags()
        {
            return HandleAppResult(await Mediator.Send(new GetAllFilterTagQuery()));
        }
    }
}
