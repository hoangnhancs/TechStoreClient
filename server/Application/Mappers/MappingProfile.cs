using System;
using Application.DTOs;
using Domain.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;

namespace Application.Mappers;


public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Image != null ? src.Image.Url : string.Empty));

        CreateMap<Address, AddressDto>();
        CreateMap<AddressDto, Address>();

        CreateMap<BasketItem, BasketItemDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product!.Price))
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.Product!.Brand))
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Product!.Category))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product!.MainImageUrl));
        CreateMap<Basket, BasketDto>();

        CreateMap<Category, CategoryDto>();
        CreateMap<CategoryDto, Category>();

        CreateMap<Comment, CommentDto>();
        CreateMap<CommentDto, Comment>();

        CreateMap<OrderItemDto, OrderItem>();
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product!.MainImageUrl));
        CreateMap<Order, OrderDto>();
        CreateMap<OrderDto, Order>()
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Items.Sum(x => x.UnitPrice * x.Quantity) + src.ShippingCost - src.Discount));
        CreateMap<CreateOrUpdateOrderDto, OrderDto>();

        CreateMap<Payment, PaymentDto>();

        CreateMap<ProductAttribute, ProductAttributeDto>();
        CreateMap<ProductAttributeDto, ProductAttribute>();

        CreateMap<ProductImage, ProductImageDto>();
        CreateMap<ProductImageDto, ProductImage>();


        CreateMap<ProductDto, Product>()
            .ForMember(dest => dest.MainImageUrl, opt => opt.MapFrom(src => src.ImageUrl))
            .ForMember(dest => dest.DetailImages, opt => opt.MapFrom(src => src.Images))
            .ForMember(dest => dest.DisplayTags, opt => opt.MapFrom(src => src.Tags))
            .ForMember(dest => dest.MainImagePublicId, opt => opt.MapFrom(src => src.ImagePublicId));
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.MainImageUrl))
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.DetailImages))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.DisplayTags))
            .ForMember(dest => dest.ImagePublicId, opt => opt.MapFrom(src => src.MainImagePublicId));

        CreateMap<FilterTag, FilterTagDto>();
        CreateMap<FilterTagDto, FilterTag>();

        CreateMap<FilterTagValue, FilterTagValueDto>();
        CreateMap<FilterTagValueDto, FilterTagValue>();

        CreateMap<ProductTagFilter, ProductTagFilterDto>()
            .ForMember(dest => dest.FilterTagId, opt => opt.MapFrom(src => src.FilterTagValue!.FilterTagId));
        CreateMap<ProductTagFilterDto, ProductTagFilter>();

        CreateMap<ProductTag, ProductTagDto>();
        CreateMap<Review, ReviewDto>();
        CreateMap<ReviewDto, Review>();

        CreateMap<BannerImage, BannerImageDto>();
        CreateMap<BannerImageDto, BannerImage>();

        CreateMap<Notification, NotificationDto>();
        CreateMap<NotificationDto, Notification>();
    }
}
