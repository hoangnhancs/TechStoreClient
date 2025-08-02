using System;
using Application.Core;
using Application.Interface;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Products;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, AppResult<Unit>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductRepository _productRepository;
    private readonly IPhotoService _photoService;
    public DeleteProductHandler(IUnitOfWork unitOfWork, IProductRepository productRepository, IPhotoService photoService)
    {
        _unitOfWork = unitOfWork;
        _productRepository = productRepository;
        _photoService = photoService;
    }
    public async Task<AppResult<Unit>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetProductByIdAsync(request.ProductId, cancellationToken);
        if (product == null) return AppResult<Unit>.Failure("Product not found", 404);
        product.IsActive = false;
        await _productRepository.UpdateProductAsync(product, DateTime.UtcNow, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!string.IsNullOrEmpty(product.MainImagePublicId))
        {
            await _photoService.DeletePhoto(product.MainImagePublicId);
            //chi nhung product moi, moi upload anh len cloudinary\
            //check publicID neu valid thi xoa
        }
        if (product.DetailImages != null && product.DetailImages.Count > 0)
        {
            foreach (var image in product.DetailImages)
            {
                if (!string.IsNullOrEmpty(image.PublicId))
                {
                    await _photoService.DeletePhoto(image.PublicId);
                }
            }
            //ims detail cung valid thi xoa
        }
         
        return AppResult<Unit>.Success(Unit.Value);
    }
}
