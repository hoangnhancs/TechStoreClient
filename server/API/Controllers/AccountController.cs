using System;
using System.Net;
using System.Text;
using System.Text.Json;
using API.DTOs;
using Application.Commands.Baskets;
using Application.DTOs;
using Application.Interface;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenServices _tokenServices;
    private readonly IConfiguration _config;
    private readonly IEmailSender<User> _emailSender;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IHttpContextAccessorHelper _httpContextAccessorHelper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserAccessor _userAccessor;

    public AccountController(SignInManager<User> signInManager, ITokenServices tokenServices, IConfiguration config, IEmailSender<User> emailSender,
                            IRefreshTokenRepository refreshTokenRepository, IHttpContextAccessorHelper httpContextAccessorHelper, IUnitOfWork unitOfWork, IUserAccessor userAccessor)
    {
        _signInManager = signInManager;
        _tokenServices = tokenServices;
        _config = config;
        _emailSender = emailSender;
        _refreshTokenRepository = refreshTokenRepository;
        _httpContextAccessorHelper = httpContextAccessorHelper;
        _unitOfWork = unitOfWork;
        _userAccessor = userAccessor;
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

        var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);


        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("error", error.Description);
            }
            return BadRequest(ModelState); // lỗi tạo user
        }
        else
        {
            await SendConfirmationEmailAsync(user, registerDto.Email);
        }

        await Mediator.Send(new CreateBasketCommand { UserId = user.Id });
        await _signInManager.UserManager.AddToRoleAsync(user, "Member");


        return Ok(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.Image?.Url ?? string.Empty,
            TotalSpent = user.TotalSpent,
            Roles = ["Member"],
            // user.Photos,
        });
    }

    [HttpGet("user-info")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();

        var user = await _userAccessor.GetUserAsync();

        if (user == null) return Unauthorized("User not found");

        var roles = await _signInManager.UserManager.GetRolesAsync(user);
        List<string> listRoles = new List<string>(roles);

        return Ok(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.Image?.Url ?? string.Empty,
            Roles = listRoles,
            DateOfBirth = user.DateOfBirth,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Gender = user.Gender.ToString(),
            Email = user.Email ?? string.Empty,
        });
    }

    [HttpPost("logout")]

    public async Task<ActionResult> Logout()
    {       
        var token = Request.Cookies["refresh_token"];
        string ipAddress = _httpContextAccessorHelper.GetClientIp();
        if (!string.IsNullOrEmpty(token))
        {
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(token);
            if (refreshToken != null && refreshToken.IsActive)
            {
                await _refreshTokenRepository.RevokeAsync(token, ipAddress, "logout");
                await _unitOfWork.SaveChangesAsync(CancellationToken.None);
            }
        }
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        Response.Cookies.Delete("user");
        await _signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpPost("change-password")]
    [Authorize(Policy = "SecurityStampRequirement")]
    public async Task<ActionResult> ChangePassword(ChangePasswordDto passwordDto)
    {
        //b1: check user
        var user = await _signInManager.UserManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        //b2: doi mat khau
        var result = await _signInManager.UserManager
            .ChangePasswordAsync(user, passwordDto.CurrentPassword, passwordDto.NewPassword);

        if (!result.Succeeded) return BadRequest(result.Errors.First().Description);

        //b3: revoke token
        var ipAddress = _httpContextAccessorHelper.GetClientIp();
        await _refreshTokenRepository.RevokeAllAsync(user.Id, ipAddress, "pwchanged");
        await _unitOfWork.SaveChangesAsync(CancellationToken.None);

        //b4: xoa cookies
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        Response.Cookies.Delete("user");

        //b5: logout
        await _signInManager.SignOutAsync();

        return Ok("Change password successfully for user " + user.UserName);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        var result = await _signInManager.PasswordSignInAsync(
            loginDto.Email,
            loginDto.Password,
            isPersistent: true,  // Set to true if you want "remember me" functionality
            lockoutOnFailure: false);  // Set to true to enable account lockout on failed attempts

        if (!result.Succeeded) return Unauthorized();

        var user = await _userAccessor.GetUserAsync();

        if (user == null) return Unauthorized();

        var roles = await _signInManager.UserManager.GetRolesAsync(user);
        var accessToken = await _tokenServices.CreateAccessTokenAsync(user);
        Response.Cookies.Append("access_token", accessToken.Token, new CookieOptions
        {
            HttpOnly = true, //httponly, k cho phep FE doc cookies
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = accessToken.Expires
        });
        var ipAddress = _httpContextAccessorHelper.GetClientIp();
        var refreshToken = _tokenServices.CreateRefreshToken(user, ipAddress);
        await _refreshTokenRepository.AddAsync(refreshToken);
        await _unitOfWork.SaveChangesAsync(CancellationToken.None);

        Response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true, //httponly, k cho phep FE doc cookies
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshToken.Expires
        });

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var userInforJson = JsonSerializer.Serialize(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.Image?.Url ?? string.Empty,
            Roles = roles.ToList(),
            DateOfBirth = user.DateOfBirth,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Gender = user.Gender.ToString(),
            TotalSpent = user.TotalSpent,
        }, options); //set cookies nhung thong tin co ban cua user
        Response.Cookies.Append("user", userInforJson, new CookieOptions
        {
            HttpOnly = false, // cho phep FE doc cookies
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = accessToken.Expires,
            IsEssential = true
        });
        return Ok(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.Image?.Url ?? string.Empty,
            Roles = roles.ToList(),
            // user.Photos,
        });

        // return Ok( new {token});
    }

    [AllowAnonymous]
    [HttpPost("refreshToken")]
    public async Task<IActionResult> RefreshToken()
    {
        //b1: lay rf token tu cookie
        var refreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

        //b2: kiem tra rf token co hop le khong, neu co thi revoke and replace by token moi
        var tokenInDb = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (tokenInDb == null || !tokenInDb.IsActive) return Unauthorized();

        var user = await _signInManager.UserManager.FindByIdAsync(tokenInDb.UserId);
        if (user == null) return Unauthorized();

        var newAccessToken = await _tokenServices.CreateAccessTokenAsync(user);
        var ipAddress = _httpContextAccessorHelper.GetClientIp();
        var newRefreshToken = _tokenServices.CreateRefreshToken(user, ipAddress);

        await _refreshTokenRepository.RevokeAsync(refreshToken, ipAddress, "refresh"); //revoke refresh token cu

        //b3: cap nhat rf token moi vao db va update token cu
        await _refreshTokenRepository.AddAsync(newRefreshToken);
        await _unitOfWork.SaveChangesAsync(CancellationToken.None);

        //b4: gan vao response
        Response.Cookies.Append("access_token", newAccessToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = newAccessToken.Expires
        });

        Response.Cookies.Append("refresh_token", newRefreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = newRefreshToken.Expires
        });

        var roles = await _signInManager.UserManager.GetRolesAsync(user);
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        var userInforJson = JsonSerializer.Serialize(new UserDto
        {
            DisplayName = user.DisplayName ?? string.Empty,
            Id = user.Id,
            ImageUrl = user.Image?.Url ?? string.Empty,
            Roles = roles.ToList(),
            DateOfBirth = user.DateOfBirth,
            PhoneNumber = user.PhoneNumber ?? string.Empty,
            Gender = user.Gender.ToString(),
            TotalSpent = user.TotalSpent,
        }, options); //set cookies nhung thong tin co ban cua user
        Response.Cookies.Append("user", userInforJson, new CookieOptions
        {
            HttpOnly = false, // cho phep FE doc cookies
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = newAccessToken.Expires,
            IsEssential = true
        });
        var response = new
        {
            accessTokenExpiration = newAccessToken.Expires
        };
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("resendConfirmEmail")]
    public async Task<IActionResult> ResendConfirmEmail([FromBody]ForgotPasswordDto fgpDto)
    {
        if (string.IsNullOrEmpty(fgpDto.Email) && string.IsNullOrEmpty(fgpDto.UserId))
        {
            return BadRequest("Email or UserId must be provided");
        }
        var user = await _signInManager.UserManager.Users.FirstOrDefaultAsync(x => x.Email == fgpDto.Email || x.Id == fgpDto.UserId);

        if (user == null || string.IsNullOrEmpty(user.Email))
            return BadRequest("User not found or email not valid");

        await SendConfirmationEmailAsync(user, user.Email);

        return Ok();
    }

    private async Task SendConfirmationEmailAsync(User user, string email)
    {
        var code = await _signInManager.UserManager.GenerateEmailConfirmationTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var confirmEmailUrl = $"{_config["ClientAppUrl"]}/confirm-email?userId={user.Id}&code={code}";
        await _emailSender.SendConfirmationLinkAsync(user, email, confirmEmailUrl);
    }
}
