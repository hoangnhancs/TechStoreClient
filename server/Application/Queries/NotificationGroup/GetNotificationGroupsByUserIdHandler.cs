using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.NotificationGroup;

public class GetNotificationGroupsByUserIdHandler : IRequestHandler<GetNotificationGroupsByUserIdQuery, AppResult<List<NotificationGroupDto>>>
{
    private readonly INotificationGroupRepository _notificationGroupRepository;
    private readonly IMapper _mapper;
    public GetNotificationGroupsByUserIdHandler(INotificationGroupRepository notificationGroupRepository, IMapper mapper)
    {
        _notificationGroupRepository = notificationGroupRepository;
        _mapper = mapper;
    }
    public async Task<AppResult<List<NotificationGroupDto>>> Handle(GetNotificationGroupsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var notiGrs = await _notificationGroupRepository.GetNotificationGroupByUserId(request.UserId);
        var notiGrsDto = _mapper.Map<List<NotificationGroupDto>>(notiGrs);
        return AppResult<List<NotificationGroupDto>>.Success(notiGrsDto);
    }
}
