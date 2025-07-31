using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Queries.NotificationGroup;

public class GetNotificationGroupsByUserIdHandler : IRequestHandler<GetNotificationGroupsByUserIdQuery, Result<List<NotificationGroupDto>>>
{
    private readonly INotificationGroupRepository _notificationGroupRepository;
    private readonly IMapper _mapper;
    public GetNotificationGroupsByUserIdHandler(INotificationGroupRepository notificationGroupRepository, IMapper mapper)
    {
        _notificationGroupRepository = notificationGroupRepository;
        _mapper = mapper;
    }
    public async Task<Result<List<NotificationGroupDto>>> Handle(GetNotificationGroupsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var notiGrs = await _notificationGroupRepository.GetNotificationGroupByUserId(request.UserId);
        var notiGrsDto = _mapper.Map<List<NotificationGroupDto>>(notiGrs);
        return Result<List<NotificationGroupDto>>.Success(notiGrsDto);
    }
}
