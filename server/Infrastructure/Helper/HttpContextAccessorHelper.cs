using System;
using Application.Interface;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Helper;

public class HttpContextAccessorHelper : IHttpContextAccessorHelper
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public HttpContextAccessorHelper(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public string GetClientIp()
    {
        var context = _httpContextAccessor.HttpContext;
        return context?.Request.Headers["X-Forwarded-For"].FirstOrDefault()
               ?? context?.Connection.RemoteIpAddress?.ToString()
               ?? string.Empty;
    }
}
