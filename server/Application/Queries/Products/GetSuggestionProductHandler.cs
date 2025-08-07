using System;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Queries.Products;

public class GetSuggestionProductHandler : IRequestHandler<GetSuggestionProductQuery, AppResult<List<ProductDto>>>
{
    public List<float> MultiplyWithWeight(List<float> values, float weight)
    {
        return values.Select(v => v * weight).ToList();
    }

    public List<float> ComputeAverageVector(List<List<float>> vectors)
    {
        if (vectors == null || vectors.Count == 0)
            return new List<float>();

        int dimension = vectors[0].Count;
        var result = new float[dimension];

        foreach (var vec in vectors)
        {
            for (int i = 0; i < dimension; i++)
            {
                result[i] += vec[i];
            }
        }

        for (int i = 0; i < dimension; i++)
        {
            result[i] /= vectors.Count;
        }

        return result.ToList();
    }

    public static float CosineSimilarity(List<float> a, List<float> b)
    {
        if (a.Count != b.Count) throw new ArgumentException("Vectors must have the same length");

        float dot = 0f;
        float normA = 0f;
        float normB = 0f;

        for (int i = 0; i < a.Count; i++)
        {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        return (float)(dot / (Math.Sqrt(normA) * Math.Sqrt(normB)));
    }

    private readonly IProductRepository _productRepository;
    private readonly IUserActionTrackingRepository _userActionTrackingRepository;
    private readonly IProductVectorEmbeddingRepository _productVectorEmbeddingRepository;
    private readonly IMapper _mapper;
    private readonly StoreContext _context;
    public GetSuggestionProductHandler(IProductRepository productRepository, IUserActionTrackingRepository userActionTrackingRepository,
        IProductVectorEmbeddingRepository productVectorEmbeddingRepository, IMapper mapper, StoreContext context)
    {
        _productRepository = productRepository;
        _userActionTrackingRepository = userActionTrackingRepository;
        _mapper = mapper;
        _productVectorEmbeddingRepository = productVectorEmbeddingRepository;
        _context = context;
    }
    public async Task<AppResult<List<ProductDto>>> Handle(GetSuggestionProductQuery request, CancellationToken cancellationToken)
    {
        if (request.UserId == null)
        {
            var top10SoldProduct = _productRepository.GetTop10SoldProducts(cancellationToken).Result;
            return AppResult<List<ProductDto>>.Success(_mapper.Map<List<ProductDto>>(top10SoldProduct));
        }
        var userTracking = _userActionTrackingRepository.GetUserActionTrackingByUserId(request.UserId, cancellationToken).Result;
        if (userTracking == null || userTracking.Count == 0)
        {
            var top10SoldProduct = _productRepository.GetTop10SoldProducts(cancellationToken).Result;
            return AppResult<List<ProductDto>>.Success(_mapper.Map<List<ProductDto>>(top10SoldProduct));
        }
        var productTrackingWeight = new Dictionary<string, float>();//weight of each product in the user tracking list
        var hashSetProductId = new HashSet<string>();
        foreach (var item in userTracking)
        {
            float weight = item.ActionType switch
            {
                UserActionTracking.UserActionType.View => 1f,
                UserActionTracking.UserActionType.AddToCart => 1.5f,
                UserActionTracking.UserActionType.Purchase => 2f,
                _ => 0f
            };
            if (weight == 0f) continue;
            if (productTrackingWeight.ContainsKey(item.ProductId))
            {
                productTrackingWeight[item.ProductId] += weight;
            }
            else
            {
                productTrackingWeight.Add(item.ProductId, weight);
            }
            hashSetProductId.Add(item.ProductId);
        }
        var productEmbedVectors = await _productVectorEmbeddingRepository.GetProductVectorEmbeddingsByProductIds(hashSetProductId, cancellationToken);
        var inputVectors = new List<List<float>>();
        foreach (var item in productEmbedVectors)
        {
            var tmpVector = MultiplyWithWeight(item.Embedding, productTrackingWeight[item.ProductId]);
            inputVectors.Add(tmpVector);
        }
        var avgEmbedVector = ComputeAverageVector(inputVectors);
        var allVectorsWithProduct = await _context.ProductVectorEmbeddings
            .Include(p => p.Product)
            .Where(p => p.Product!.IsActive)
            .ToListAsync(cancellationToken);

        var resultsVectors = allVectorsWithProduct
            .Select(p => new
            {
                Product = p.Product,
                Score = CosineSimilarity(avgEmbedVector, p.Embedding)
            })
            .OrderByDescending(x => x.Score)
            .Take(10);

        return AppResult<List<ProductDto>>.Success(_mapper.Map<List<ProductDto>>(resultsVectors.Select(x => x.Product).ToList()));
    }
}
