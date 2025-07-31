using System;
using System.Security.Claims;
using Application.Commands.Notifications;
using Application.DTOs;
using Application.Queries.NotificationGroup;
using Application.Queries.Notifications;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class NotificationHub : Hub
{
    private readonly IMediator _mediator;

    public NotificationHub(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    public async Task SendNotification(string title, string message, string? link, string? receiverId, string? groupId, string senderId, string? commentResultId, string? reviewResultId)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("ReviewError", "User not authenticated");
            return;
        }
        // var roles = Context.User?.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
        var command = new CreateNotificationCommand
        {
            CommentResultId = commentResultId,
            ReviewResultId = reviewResultId,
            NotificationDto = new NotificationDto
            {
                Title = title,
                Message = message,
                Link = link,
                ReceiverId = receiverId,
                GroupId = groupId,
                SenderId = senderId
            }
        };
        var result = await _mediator.Send(command);
        if (String.IsNullOrEmpty(receiverId))
        {
            await Clients.Group("admin-notifications").SendAsync("ReceiveNotification", result.Value);
            Console.WriteLine($"Sent notification to group admin-notifications");
        }
        else if (String.IsNullOrEmpty(groupId))
        {
            await Clients.Group($"{receiverId}-notifications").SendAsync("ReceiveNotification", result.Value);
            Console.WriteLine($"Sent notification to group {receiverId}-notifications");
        }

    }
    public async Task LoadAllNotifications()
    {
        var notifications = new List<NotificationDto>();
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("NotificationError", "User not authenticated");
            return;
        }

        var notiGrsResult = await _mediator.Send(new GetNotificationGroupsByUserIdQuery { UserId = userId });
        if (notiGrsResult.IsSuccess && notiGrsResult.Value != null)
        {
            foreach (var gorup in notiGrsResult.Value)
            {
                var notisResult = await _mediator.Send(new GetNotificationsByGroupIdQuery { GroupId = gorup.Id });
                if (notisResult.IsSuccess && notisResult.Value != null)
                {
                    notifications.AddRange(notisResult.Value);
                }
            }
        }

        var userRoles = Context.User?.FindAll(ClaimTypes.Role).Select(x => x.Value).ToList();
        if (userRoles?.Contains("Admin") == false)
        {
            var personnalNotisResult = await _mediator.Send(new GetListNotificationsByUserIdQuery { UserId = userId });
            if (personnalNotisResult.IsSuccess && personnalNotisResult.Value != null)
            {
                notifications.AddRange(personnalNotisResult.Value);
            }
        }
            
        await Clients.Caller.SendAsync("ReceiveAllNotifications", notifications);

    }
    public async Task JoinNotificationGroup()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("ReviewError", "User not authenticated");
            Console.WriteLine("User not authenticated");
            return;
        }

        //admin thi only join group admin
        var notiGrsResult = await _mediator.Send(new GetNotificationGroupsByUserIdQuery { UserId = userId });
        if (notiGrsResult.IsSuccess && notiGrsResult.Value != null)
        {
            foreach (var group in notiGrsResult.Value)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, group.Name);
                Console.WriteLine($"Client {userId} joined group {group.Name}");
            }
        }
        
        var roles = Context.User?.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
        //ca nhan chi dung cho ca nhan
        if (roles?.Contains("Admin") == false)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{userId}-notifications");
            Console.WriteLine($"Client {userId} joined group {userId}-notifications");
        }
    }

    public async Task LeaveNotificationGroup()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }
        var userRoles = Context.User?.FindAll(ClaimTypes.Role).Select(x => x.Value).ToList();
        if (userRoles?.Contains("Admin") == true)
        {  
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "admin-notifications");
        }
        else
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"{userId}-notifications");
        }
        
    }
}
