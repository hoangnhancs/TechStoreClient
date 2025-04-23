using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFoundRequest()
    {
        return NotFound("This is not found");
    }

    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("This is bad request");
    }
    [HttpGet("unauthorised")]
    public IActionResult GetUnauthorised()
    {
        return Unauthorized("This is unauthorized");
    }

    

    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem1", "This is validation error");
        ModelState.AddModelError("Problem2", "This is validation error");
        return ValidationProblem();
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("This is server error");
    }
}
