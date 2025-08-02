using Application.Queries.FilterTagValues;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FilterTagValueController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("filtertagvalues")]
        public async Task<IActionResult> GetFilterTagValues([FromQuery] int catId)
        {
            return HandleAppResult(await Mediator.Send(new GetListFilterTagValueByCategoryQuery
            {
                CategoryId = catId
            }));
        }
    }
}
