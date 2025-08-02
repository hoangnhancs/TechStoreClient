using System;
using Application.Core;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Baskets;

public class CreateBasketHandler : IRequestHandler<CreateBasketCommand, AppResult<Unit>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBasketRepository _basketRepository;
    public CreateBasketHandler(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
    {
        _basketRepository = basketRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<Unit>> Handle(CreateBasketCommand request, CancellationToken cancellationToken)
    {
        await _basketRepository.CreateBasketAsync(request.UserId, cancellationToken);
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return AppResult<Unit>.Failure("Problem when create basket", 400);
        return AppResult<Unit>.Success(Unit.Value);
    }
}
