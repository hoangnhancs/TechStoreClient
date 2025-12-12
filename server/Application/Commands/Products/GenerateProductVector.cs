using System;
using System.Diagnostics;
using System.Text.Json;
using Application.Core;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Persistence;

namespace Application.Commands.Products;

public class GenerateProductVector
{
    public class ProductVector
    {
        public string id { get; set; } = string.Empty;
        public List<float> embedding { get; set; } = new();
    }
    public class Command : IRequest<AppResult<List<ProductVector>>>
    {

    }

    public class Handler : IRequestHandler<Command, AppResult<List<ProductVector>>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly StoreContext _context;
        public Handler(StoreContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }
        public async Task<AppResult<List<ProductVector>>> Handle(Command request, CancellationToken cancellationToken)
        {
            if (_context.ProductVectorEmbeddings.Any()) return AppResult<List<ProductVector>>.Success(new List<ProductVector>());
            var psi = new ProcessStartInfo
            {
                FileName = "python3", // hoặc "python"
                Arguments = $"\"../ApplicationPythonScripts/EmbedProductVector.py\"", // truyền param nếu cần
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            var process = new Process { StartInfo = psi };

            try
            {
                process.Start();

                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();

                process.WaitForExit();

                if (process.ExitCode != 0)
                {
                    return AppResult<List<ProductVector>>.Failure("Failed to generate product vector", 400);
                }

                // TODO: parse output nếu cần (JSON, list v.v.)
                try
                {
                    var vectors = JsonSerializer.Deserialize<List<ProductVector>>(output);
                    foreach (var vector in vectors!)
                    {
                        var newProductVector = new ProductVectorEmbedding
                        {
                            ProductId = vector.id,
                            Embedding = vector.embedding
                        };
                        await _context.AddAsync(newProductVector);
                    }
                    var result = await _unitOfWork.CommitAsync(cancellationToken);
                    if (!result) return AppResult<List<ProductVector>>.Failure("Problem when generate product vector", 400);
                    return AppResult<List<ProductVector>>.Success(vectors!);
                }
                catch (JsonException jsonEx)
                {
                    return AppResult<List<ProductVector>>.Failure("JSON parsing error: " + jsonEx.Message + "\nRaw output: " + output, 500);
                }
            }
            catch (Exception ex)
            {
                return AppResult<List<ProductVector>>.Failure("Error running python script: " + ex.Message, 400);
            }
            finally
            {
                process.Dispose();
            }
        }
    }
}
