using System;

namespace Application.Interface;

public interface IHttpContextAccessorHelper
{
    string GetClientIp();
}
