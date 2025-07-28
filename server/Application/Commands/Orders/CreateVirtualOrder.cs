using System;
using System.Globalization;
using Application.Core;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Commands.Orders;

public class CreateVirtualOrder
{
    public class Command : IRequest<Result<Unit>>
    {

    }
    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IAddressRepository _addressRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly StoreContext _context;
        private readonly IProductRepository _productRepository;

        public Handler(IOrderRepository orderRepository, IUnitOfWork unitOfWork, StoreContext context, IAddressRepository addressRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
            _context = context;
            _addressRepository = addressRepository;
            _productRepository = productRepository;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var users = await _context.Users.Where(u => u.Email != "admin@gmail.com").ToListAsync(cancellationToken);
            var random = new Random();
            var toDate = DateTime.UtcNow;
            var fromDate = toDate.AddDays(-365);
            var range = (toDate - fromDate).TotalSeconds;
            var products = await _context.Products.ToListAsync(cancellationToken);
            //tao 600 don hang ao
            for (int i = 0; i < 600; i++)
            {
                
                var user = users[random.Next(users.Count)];
                var randomSeconds = random.Next(0, (int)range);
                var randomDate = fromDate.AddSeconds(randomSeconds);
                var address = await _addressRepository.GetDefaultAddressAsync(user.Id, cancellationToken);
                if (address == null)
                {
                    throw new Exception($"User {user.Id} does not have a default address.");
                }
                var shippingAddressId = address.Id;
                var billingAddressId = address.Id;
                var availableMethods = Enum.GetValues(typeof(PaymentMethod))
                    .Cast<PaymentMethod>()
                    .Where(pm => pm != PaymentMethod.NotSelected && pm != PaymentMethod.CreditCard)
                    .ToList(); // Exclude NotSelected and CreditCard methods
                var newOrder = new Domain.Entities.Order()
                {
                    UserId = user.Id,
                    ShippingAddressId = shippingAddressId,
                    BillingAddressId = billingAddressId,
                    ShippingCost = random.Next(10000, 50000),
                    Discount = random.Next(0, 10000),
                    PaymentStatus = PaymentStatus.Paid,
                    PaymentMethod = availableMethods[random.Next(availableMethods.Count)],
                    CreatedAt = randomDate,
                    UpdatedAt = randomDate.AddSeconds(random.Next(0, 3600)),
                    OrderStatus = OrderStatus.Completed,
                };

                var numberItems = random.Next(1, 5);
                var items = new List<OrderItem>();
                var total = 0L;
                for (int j = 0; j < numberItems; j++)
                {
                    var product = products[random.Next(products.Count)];
                    var quantity = random.Next(1, 5);
                    items.Add(new OrderItem
                    {
                        OrderId = newOrder.Id,
                        ProductId = product.Id,
                        Quantity = quantity,
                        UnitPrice = product.Price
                    });
                    total += (long)(product.Price * quantity);
                    //update product unit_sold
                    product.UnitSold += quantity;
                    await _productRepository.UpdateProductAsync(product, null, cancellationToken);
                }
                newOrder.Items = items;
                newOrder.Total = total;
                newOrder.SubToTal = total - newOrder.Discount + newOrder.ShippingCost;
                _context.Orders.Add(newOrder);
                //create payment
                var paymment = new Domain.Entities.Payment
                {
                    UserId = user.Id,
                    OrderId = newOrder.Id,
                    Status = Domain.Entities.Payment.PaymentStatus.Succeeded,
                    CreatedAt = newOrder.UpdatedAt ?? DateTime.UtcNow,
                    UpdatedAt = (newOrder.UpdatedAt?.AddMilliseconds(random.Next(0, 100))) ?? DateTime.UtcNow.AddMilliseconds(random.Next(0, 100)),
                };
                _context.Payments.Add(paymment);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
