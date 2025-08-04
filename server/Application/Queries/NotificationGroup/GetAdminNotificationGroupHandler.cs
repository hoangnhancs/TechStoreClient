using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.NotificationGroup;

public class GetAdminNotificationGroupHandler : IRequestHandler<GetAdminNotificationGroupQuery, AppResult<NotificationGroupDto>>
{
    private readonly IMapper _mapper;
    private readonly INotificationGroupRepository _notificationGroupRepository;
    public GetAdminNotificationGroupHandler(IMapper mapper, INotificationGroupRepository notificationGroupRepository)
    {
        _mapper = mapper;
        _notificationGroupRepository = notificationGroupRepository;
    }
    public async Task<AppResult<NotificationGroupDto>> Handle(GetAdminNotificationGroupQuery request, CancellationToken cancellationToken)
    {
        var notiGr = await _notificationGroupRepository.GetAdminNotificationGroup(cancellationToken);
        var notiGrDto = _mapper.Map<NotificationGroupDto>(notiGr);
        return AppResult<NotificationGroupDto>.Success(notiGrDto);
    }
}
