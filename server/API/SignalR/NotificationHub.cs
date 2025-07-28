using System;
using System.Security.Claims;
using Application.Commands.Notifications;
using Application.DTOs;
using Application.Queries.Notifications;
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
    public async Task SendNotification(string title, string message, string? link, string receivedId)
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("ReviewError", "User not authenticated");
            return;
        }
        var command = new CreateNotificationCommand
        {
            NotificationDto = new NotificationDto
            {
                Tittle = title,
                Message = message,
                Link = link,
                ReceivedId = receivedId,
            }
        };
        await _mediator.Send(command);
    }
    public async Task LoadAllNotifications()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("NotificationError", "User not authenticated");
            return;
        }

        var query = new GetListNotificationsByUserIdQuery { UserId = userId };
        var result = await _mediator.Send(query);

        if (result.IsSuccess && result.Value != null)
        {
            await Clients.Caller.SendAsync("ReceiveAllNotifications", result.Value);
        }
        else
        {
            await Clients.Caller.SendAsync("NotificationError", result.Error);
        }
    }
    public async Task JoinNotificationGroup()
    {
        var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            await Clients.Caller.SendAsync("ReviewError", "User not authenticated");
            return;
        }

        var roles = Context.User?.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        if (roles?.Contains("Admin") == true)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admin-notifications");
        }
        else
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"{userId}-notifications");
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
