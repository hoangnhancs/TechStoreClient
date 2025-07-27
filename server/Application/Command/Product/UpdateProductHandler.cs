using System;
using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Command.Product;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand, Result<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;   
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPhotoService _photoService;

    public UpdateProductHandler(IProductRepository productRepository, IMapper mapper, IUnitOfWork unitOfWork, IPhotoService photoService)
    {
        _productRepository = productRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
        _photoService = photoService;
    }
    public async Task<Result<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        if (request.ProductDto.Id == null) return Result<ProductDto>.Failure("Product ID cannot be null or empty", 400);
        var existingProduct = await _productRepository.GetProductByIdAsync(request.ProductDto.Id, cancellationToken);
        if (existingProduct == null) return Result<ProductDto>.Failure("Product not found", 404);
        var newProduct = _mapper.Map<Domain.Entities.Product>(request.ProductDto);

        //main image handler
        if (request.MainImageInput != null)
        {
            if (request.MainImageInput.File != null && request.MainImageInput.File.Length > 0)
            {
                //neu co upload anh moi (chac chan type IFromFile, con giu nguyen thi se URL)
                //xoa anh cu~, upload anh moi va replace
                var imageUploadResult = await _photoService.UploadPhoto(request.MainImageInput.File);
                if (imageUploadResult == null) return Result<ProductDto>.Failure("Image upload failed", 502);
                //upload ok thi xoa anh cu~ neu anh do nam tren cloudinary
                if (!string.IsNullOrEmpty(existingProduct.MainImagePublicId))
                {
                    await _photoService.DeletePhoto(existingProduct.MainImagePublicId);
                }
                //thay the anh moi
                newProduct.MainImageUrl = imageUploadResult.Url;
                newProduct.MainImagePublicId = imageUploadResult.PublicId;
            }
            if (request.MainImageInput.Url != null && request.MainImageInput.Url.Length > 0)
            //neu la URL thi main image k co thay doi, lay tu existing product
            {
                newProduct.MainImageUrl = existingProduct.MainImageUrl;
                newProduct.MainImagePublicId = existingProduct.MainImagePublicId;
            }
        }

        //detail images handler
        if (request.DetailImageInputs != null)
        {
            //detailiamges.url: list image url (anh cu~ ma` duoc giu~ lai)
            // kiem tra url existing neu khong ton tai trong list nay thi xoa, neu ton tai thi khong xoa
            foreach (var image in existingProduct.DetailImages)
            {
                if (!request.DetailImageInputs.Urls.Contains(image.ImageUrl))
                {
                    if (!string.IsNullOrEmpty(image.PublicId))
                    {
                        await _photoService.DeletePhoto(image.PublicId);
                    }
                }
                else
                {
                    newProduct.DetailImages.Add(image);
                }
            }

            // var newDetailImages = new List<ProductImage>();
            //detailimages.file: list image file (anh moi)
            foreach (var image in request.DetailImageInputs.Files)
            {
                var imageUploadResult = await _photoService.UploadPhoto(image);
                if (imageUploadResult == null) throw new Exception($"Image upload failed for image: {image.Name}");
                var newDetailImage = new ProductImage
                {
                    ImageUrl = imageUploadResult.Url,
                    PublicId = imageUploadResult.PublicId,
                    ProductId = newProduct.Id
                };
                newProduct.DetailImages.Add(newDetailImage);
            }
        }

        var productAttributes = new List<ProductAttribute>();
        var displayOrder = 0;
        if (request.AttributeGroups != null && request.AttributeGroups.Count > 0)
        {
            foreach (var attributeGroup in request.AttributeGroups)
            {
                foreach (var attribute in attributeGroup.Attributes)
                {
                    productAttributes.Add(new ProductAttribute
                    {
                        Name = attribute.Key,
                        Value = attribute.Value,
                        DisplayOrder = displayOrder,
                        AttributeType = attributeGroup.GroupName, // Assuming all attributes are text type for simplicity
                    });
                    displayOrder++;
                }
            }
        }
        var filterTags = new List<ProductTagFilter>();
        foreach (var filterTag in request.FilterTags)
        {
            var filterTagValueId = filterTag.Value;
            filterTags.Add(new ProductTagFilter
            {
                FilterTagValueId = int.Parse(filterTagValueId),
            });
        }
        newProduct.Attributes = productAttributes;
        newProduct.ProductTagFilters = filterTags;

        await _productRepository.UpdateProductAsync(newProduct, DateTime.UtcNow, cancellationToken); 
        var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
        if (!result) return Result<ProductDto>.Failure("Failed to update product", 500);
        return Result<ProductDto>.Success(_mapper.Map<ProductDto>(newProduct));
    }
}
