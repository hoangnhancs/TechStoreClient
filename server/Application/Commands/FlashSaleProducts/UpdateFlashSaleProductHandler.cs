using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.FlashSaleProducts;

public class UpdateFlashSaleProductHandler : IRequestHandler<UpdateFlashSaleProductCommand, AppResult<FlashSaleProductDto>>
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFlashSaleProductRepository _flashSaleProductRepository;
    public UpdateFlashSaleProductHandler(IMapper mapper, IUnitOfWork unitOfWork, IFlashSaleProductRepository flashSaleProductRepository)
    {
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _flashSaleProductRepository = flashSaleProductRepository;
    }
    public async Task<AppResult<FlashSaleProductDto>> Handle(UpdateFlashSaleProductCommand request, CancellationToken cancellationToken)
    {
        var flashProduct = new FlashSaleProduct
        {
            ProductId = request.FlashSaleProduct.ProductId,
            FlashPrice = request.FlashSaleProduct.FlashPrice,
            TotalQuantity = request.FlashSaleProduct.TotalQuantity,
            RemainQuntity = request.FlashSaleProduct.TotalQuantity,
            StartTime = request.FlashSaleProduct.StartTime,
            EndTime = request.FlashSaleProduct.EndTime
        };

        await _flashSaleProductRepository.UpdateFlashSaleProduct(flashProduct, cancellationToken);
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result) return AppResult<FlashSaleProductDto>.Failure("Problem when update flash sale product", 400);
        return AppResult<FlashSaleProductDto>.Success(request.FlashSaleProduct);
    }
}
