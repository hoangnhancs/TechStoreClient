using System;
using Application.Core;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Payments;

public class UpdateCompletePaymentHandler : IRequestHandler<UpdateCompletePaymentCommand, AppResult<Unit>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    public UpdateCompletePaymentHandler(IOrderRepository orderRepository, IPaymentRepository paymentRepository, IUnitOfWork unitOfWork)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<Unit>> Handle(UpdateCompletePaymentCommand request, CancellationToken cancellationToken)
    {
        var unCompleteOrder = await _orderRepository.GetUnCompletedOrdersByUserIdAsync(request.UserId);
        if (unCompleteOrder == null)
        {
            return AppResult<Unit>.Failure("Không có đơn hàng chưa thanh toán.", 404);
        }
        var payment = await _paymentRepository.GetPaymentByOrderIdAsync(unCompleteOrder.Id, cancellationToken);
        if (payment == null)
        {
            return AppResult<Unit>.Failure("Không tìm thấy thông tin thanh toán.", 404);
        }
        payment.Status = Domain.Entities.Payment.PaymentStatus.Succeeded;
        await _unitOfWork.CommitAsync(cancellationToken);
        return AppResult<Unit>.Success(Unit.Value);
    }
}
