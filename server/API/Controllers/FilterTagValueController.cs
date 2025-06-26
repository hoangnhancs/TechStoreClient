using Application.Queries.FilterTagValue;
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
            return HandleResult(await Mediator.Send(new GetListFilterTagValueByCategoryQuery
            {
                CategoryId = catId
            }));
        }
    }
}
