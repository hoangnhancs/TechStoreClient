using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.FlashSaleProducts;

public class CreateFlashSaleProductHandler : IRequestHandler<CreateFlashSaleProductCommand, AppResult<FlashSaleProductDto>>
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFlashSaleProductRepository _flashSaleProductRepository;
    public CreateFlashSaleProductHandler(IMapper mapper, IFlashSaleProductRepository flashSaleProductRepository, IUnitOfWork unitOfWork)
    {
        _mapper = mapper;
        _flashSaleProductRepository = flashSaleProductRepository;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<FlashSaleProductDto>> Handle(CreateFlashSaleProductCommand request, CancellationToken cancellationToken)
    {
        var flashSaleProduct = new FlashSaleProduct
        {
            ProductId = request.FlashSaleProduct.ProductId,
            FlashPrice = request.FlashSaleProduct.FlashPrice,
            TotalQuantity = request.FlashSaleProduct.TotalQuantity,
            RemainQuntity = request.FlashSaleProduct.TotalQuantity,
            StartTime = request.FlashSaleProduct.StartTime,
            EndTime = request.FlashSaleProduct.EndTime
        };
        await _flashSaleProductRepository.CreateFlashSaleProduct(flashSaleProduct, cancellationToken);
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (!result) return AppResult<FlashSaleProductDto>.Failure("Problem when create flash sale product", 400);
        return AppResult<FlashSaleProductDto>.Success(request.FlashSaleProduct);
    }
}
