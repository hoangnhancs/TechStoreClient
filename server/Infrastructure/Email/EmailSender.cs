using System;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IResend resend, IConfiguration config) : Microsoft.AspNetCore.Identity.IEmailSender<User>
{
    public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        var subject = "Confirm your email address TechStore";
        var body = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Verify Your Email Address</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .button {{ display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; }}
                    .footer {{ margin-top: 30px; font-size: 0.9em; color: #777; }}
                </style>
            </head>
            <body>
                <p>Hi {user.DisplayName},</p>
                <p>Thank you for registering with us! This link will expire in 15 minutes, to complete your registration, please verify your email address by clicking the button below:</p>
                <p><a href='{confirmationLink}' class='button'>Verify Email Address</a></p>
                <p>If you didn't create an account with us, please ignore this email.</p>
                <div class='footer'>
                    <p>Best regards,</p>
                    <p>The TechStore Support Team</p>
                </div>
            </body>
            </html>";

        await SendEmailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        var subject = "Reset password TechStore";
        var body = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Password Reset Request</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .button {{ display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; }}
                    .footer {{ margin-top: 30px; font-size: 0.9em; color: #777; }}
                    .note {{ font-size: 0.9em; color: #666; }}
                </style>
            </head>
            <body>
                <p>Hi {user.DisplayName},</p>
                <p>We received a request to reset your password. If you made this request, please click the button below to set a new password:</p>
                <p><a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}' class='button'>
                    Reset Password</a>
                </p>
                <p class='note'>This link will expire in 15 minutes. If you don't use it by then, you'll need to request another password reset.</p>
                <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
                <div class='footer'>
                    <p>Best regards,</p>
                    <p>The TechStore Support Team</p>
                </div>
            </body>
            </html>"; //this link bring me to reset pw component

        await SendEmailAsync(email, subject, body);
    }

    public Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }
    private async Task SendEmailAsync(string email, string subject, string body)
    {
        var message = new EmailMessage
        {
            From = "whatever@resend.dev",
            Subject = subject,
            HtmlBody = body,
        };
        message.To.Add(email);
        await resend.EmailSendAsync(message);
        await Task.CompletedTask;
    }
}
