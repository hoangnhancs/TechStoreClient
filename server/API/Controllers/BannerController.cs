using Application.Commands.Banners;
using Application.Queries.Banners;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BannerController : BaseApiController
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllBannerImages()
        {
            return HandleAppResult(await Mediator.Send(new GetAllBannerImagesQuery()));
        }
        [HttpPost("create-banner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNewBannerImage([FromForm] List<IFormFile> files)
        {
            return HandleAppResult(await Mediator.Send(new CreateNewBannerImageCommand { NewImages = files }));
        }
        [HttpPost("delete-banner")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBannerImage([FromBody] List<int> bannerImageIds)
        {
            return HandleAppResult(await Mediator.Send(new DeleteBannerImageCommand { BannerImageIds = bannerImageIds }));
        }
    }
}
