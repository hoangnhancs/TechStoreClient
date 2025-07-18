using System;
using Application.Core;
using Application.DTOs;
using MediatR;

namespace Application.Queries.Order;

public class GetListOrdersInRangeDateQuery : IRequest<Result<List<OrderDto>>>
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
