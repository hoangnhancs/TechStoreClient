using Application.Queries.Brands;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BrandController : BaseApiController
    {
        // [HttpGet("all-brands")]
        // public async Task<IActionResult> GetBrands()
        // {
        //     return HandleAppResult(await Mediator.Send(new GetAllBrandsQuery()));
        // }
    }
}
