using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class RegisterDto
{
    [Required]
    public required string DisplayName { get; set; }
    [Required]
    public required string Email { get; set; }
    [Required]
    public required string Password { get; set; }
}
