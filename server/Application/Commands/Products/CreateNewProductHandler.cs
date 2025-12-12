using System;
using Application.Core;
using Application.DTOs;
using Application.Interface;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.Commands.Products;

public class CreateNewProductHandler : IRequestHandler<CreateNewProductCommand, AppResult<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;
    private readonly IUnitOfWork _unitOfWork;
    public CreateNewProductHandler(IProductRepository productRepository, IMapper mapper, IPhotoService photoService, IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _mapper = mapper;
        _photoService = photoService;
        _unitOfWork = unitOfWork;
    }
    public async Task<AppResult<ProductDto>> Handle(CreateNewProductCommand request, CancellationToken cancellationToken)
    {
        var productDto = request.ProductDto; //get productDto from request

        // Handle image upload
        var mainImageUploadResult = await _photoService.UploadPhoto(request.MainImageFile);
        if (mainImageUploadResult == null)
        {
            throw new Exception("Failed to upload main image");
        }
        var detailImageUploadResults = new List<PhotoUploadResultDto>();
        foreach (var detailImageFile in request.DetailImageFiles)
        {
            var detailImageUploadResult = await _photoService.UploadPhoto(detailImageFile);
            detailImageUploadResults.Add(detailImageUploadResult ?? throw new Exception("Failed to upload detail image"));
        }

        var product = _mapper.Map<Product>(productDto);
        var newProductId = Guid.NewGuid().ToString(); //Taạo id mới
        product.Id = newProductId; //Gán


        //gán main image url và public id sau khi upload lên cloudinary
        product.MainImageUrl = mainImageUploadResult.Url;
        product.MainImagePublicId = mainImageUploadResult.PublicId;

        var newListProductImages = new List<ProductImage>();
        foreach (var detailImageUploadResult in detailImageUploadResults)
        {
            newListProductImages.Add(new ProductImage
            {
                ImageUrl = detailImageUploadResult.Url,
                PublicId = detailImageUploadResult.PublicId,
                ProductId = newProductId //Gán id sản phẩm mới
            });
        }
        product.DetailImages = newListProductImages;

        //Handle product attributes
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
        
        //handle filter tags
        var filterTags = new List<ProductTagFilter>();
        foreach (var filterTag in request.FilterTags)
        {
            var filterTagValueId = filterTag.Value;
            filterTags.Add(new ProductTagFilter
            {
                FilterTagValueId = int.Parse(filterTagValueId), 
            });
        }
        
        product.Attributes = productAttributes;
        product.ProductTagFilters = filterTags;

        await _productRepository.AddNewProduct(product, cancellationToken);
        var result = await _unitOfWork.CommitAsync(cancellationToken);
        if (result)
        {
            var productDtoResult = _mapper.Map<ProductDto>(product);
            return AppResult<ProductDto>.Success(productDtoResult);
        }
        return AppResult<ProductDto>.Failure("Failed to create new product", 500);
    }
}
