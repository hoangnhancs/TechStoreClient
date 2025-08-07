using System;
using Application.Core;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.UserActionTrackings;

public class CreateUserActionTrackingHandler : IRequestHandler<CreateUserActionTrackingCommand, AppResult<int>>
{
    private readonly IUnitOfWork _unitOfWork;
    private IUserActionTrackingRepository _userActionTrackingRepository;
    public CreateUserActionTrackingHandler(IUnitOfWork unitOfWork, IUserActionTrackingRepository userActionTrackingRepository)
    {
        _unitOfWork = unitOfWork;
        _userActionTrackingRepository = userActionTrackingRepository;
    }
    public async Task<AppResult<int>> Handle(CreateUserActionTrackingCommand request, CancellationToken cancellationToken)
    {
        var newTracking = new UserActionTracking
        {
            UserId = request.UserId,
            ProductId = request.ProductId,
            ActionType = Enum.Parse<UserActionTracking.UserActionType>(request.ActionType)
        };
        await _userActionTrackingRepository.AddUserActionTracking(newTracking, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return AppResult<int>.Failure("Problem when create user action tracking", 400);
        return AppResult<int>.Success(newTracking.Id);
    }
}
