using System;
using Application.Core;
using MediatR;

namespace Application.Commands.Products;

public class DeleteProductCommand : IRequest<Result<Unit>>
{
    public required string ProductId { get; set; }
}
