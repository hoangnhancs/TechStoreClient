using System;

namespace Application.Core;

public class AppResult<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; }
    public string? Error { get; set; }
    public int Code { get; set; }
    public static AppResult<T> Success(T value) => new()
    {
        IsSuccess = true,
        Value = value
    };
    public static AppResult<T> Failure(string error, int code) => new()
    {
        IsSuccess = false,
        Error = error,
        Code = code,
    };
}
