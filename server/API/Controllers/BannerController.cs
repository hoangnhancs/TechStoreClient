using Application.Command.Banner;
using Application.Queries.Banner;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BannerController : BaseApiController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllBannerImages()
        {
            return HandleResult(await Mediator.Send(new GetAllBannerImagesQuery()));
        }
        [HttpPost("create-banner")]
        public async Task<IActionResult> CreateNewBannerImage([FromForm] List<IFormFile> files)
        {
            return HandleResult(await Mediator.Send(new CreateNewBannerImageCommand { NewImages = files }));
        }
        [HttpPost("delete-banner")]
        public async Task<IActionResult> DeleteBannerImage([FromBody] List<int> bannerImageIds)
        {
            return HandleResult(await Mediator.Send(new DeleteBannerImageCommand { BannerImageIds = bannerImageIds }));
        }
    }
}
