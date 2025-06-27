using System;
using API.DTOs;
using Application.Command.Baskets;
using Application.DTOs;
using Application.Interface;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly SignInManager<User> signInManager;
    private readonly ITokenServices tokenServices;

    public AccountController(SignInManager<User> signInManager, ITokenServices tokenServices)
    {
        this.signInManager = signInManager;
        this.tokenServices = tokenServices;
    }
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            DisplayName = registerDto.DisplayName,
        };

        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);


        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("error", error.Description);
            }
            return BadRequest(ModelState); // lỗi tạo user
        }

        await Mediator.Send(new CreateBasketCommand { UserId = user.Id });
        await signInManager.UserManager.AddToRoleAsync(user, "Member");


        return Ok(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.ImageUrl ?? string.Empty,
            TotalSpent = user.TotalSpent,
            Roles = ["Member"],
            // user.Photos,
        });
    }


    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        var roles = await signInManager.UserManager.GetRolesAsync(user);

        return Ok(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.ImageUrl ?? string.Empty,
            TotalSpent = user.TotalSpent,
            Roles = roles.ToList(),
            Gender = user.Gender.ToString(),
            DateOfBirth = user.DateOfBirth,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            // user.Photos,
        });
    }

    [HttpPost("logout")]

    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        return NoContent();
    }

    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword(ChangePasswordDto passwordDto)
    {
        var user = await signInManager.UserManager.GetUserAsync(User);

        if (user == null) return Unauthorized();

        var result = await signInManager.UserManager
            .ChangePasswordAsync(user, passwordDto.CurrentPassword, passwordDto.NewPassword);

        if (result.Succeeded) return Ok("Change password successfully for user " + user.UserName);

        return BadRequest(result.Errors.First().Description);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        var result = await signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password,
            isPersistent: true,  // Set to true if you want "remember me" functionality
            lockoutOnFailure: false);  // Set to true to enable account lockout on failed attempts

        if (!result.Succeeded) return Unauthorized();

        var user = await signInManager.UserManager.FindByEmailAsync(loginDto.Email);

        if (user == null) return Unauthorized();

        var roles = await signInManager.UserManager.GetRolesAsync(user);
        var createdToken = await tokenServices.CreateTokenAsync(user);
        Response.Cookies.Append("access_token", createdToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddHours(1)
        });
        return Ok(new UserDto
            {
                DisplayName = user.DisplayName ?? string.Empty,
                Id = user.Id,
                ImageUrl = user.ImageUrl ?? string.Empty,
                Roles = roles.ToList(),
                // user.Photos,
            });

        // return Ok( new {token});
    }    
}
