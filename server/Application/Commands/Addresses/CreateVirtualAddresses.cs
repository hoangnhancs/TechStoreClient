using System;
using System.Text.Json;
using Application.Core;
using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;

namespace Application.Commands.Addresses;

public class CreateVirtualAddresses
{
    public class ProvinceResponse
    {
        public int code { get; set; }
        public string? message { get; set; }
        public List<ProvinceData> data { get; set; } = new();
    }
    public class DistrictResponse
    {
        public int code { get; set; }
        public string? message { get; set; }
        public List<DistrictData> data { get; set; } = new();
    }
    public class WardResponse
    {
        public int code { get; set; }
        public string? message { get; set; }
        public List<WardData> data { get; set; } = new();
    }

    public class ProvinceData
    {
        public int ProvinceID { get; set; }
        public string? ProvinceName { get; set; }
        public string? Code { get; set; }
    }
    public class DistrictData
    {
        public int DistrictID { get; set; }
        public string? DistrictName { get; set; }
        public string? Code { get; set; }
    }
    public class WardData
    {
        public string? WardCode { get; set; }
        public string? WardName { get; set; }
        public string? Code { get; set; }
    }

    public class Command : IRequest<AppResult<Unit>>
    {

    }
    public class Handler : IRequestHandler<Command, AppResult<Unit>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly StoreContext _storeContext;
        public Handler(IUnitOfWork unitOfWork, IConfiguration configuration, StoreContext storeContext)
        {
            _configuration = configuration;
            _unitOfWork = unitOfWork;
            _storeContext = storeContext;
        }
        public async Task<AppResult<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            if (_storeContext.Addresses.Any()) return AppResult<Unit>.Success(Unit.Value);
            Random random = new Random();
            var token = _configuration["GHN:ApiToken"];
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Token", token);

            var provinceResponse = await client.GetAsync($"https://online-gateway.ghn.vn/shiip/public-api/master-data/province");
            if (!provinceResponse.IsSuccessStatusCode)
                return AppResult<Unit>.Failure($"Failed to fetch wards.", (int)provinceResponse.StatusCode);
            var provinceContent = await provinceResponse.Content.ReadAsStringAsync();
            var provinceJsonResult = JsonSerializer.Deserialize<ProvinceResponse>(provinceContent);
            var provinces = provinceJsonResult?.data;
            if (provinceJsonResult == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);
            if (provinces == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);

            var users = await _storeContext.Users.ToListAsync(cancellationToken);

            foreach (var user in users)
            {
                var randomProvince = provinces[random.Next(provinces.Count)];
                var districtResponse = await client.GetAsync($"https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id={randomProvince.ProvinceID}");
                if (!districtResponse.IsSuccessStatusCode)
                    return AppResult<Unit>.Failure($"Failed to fetch wards.", (int)districtResponse.StatusCode);
                var districtContent = await districtResponse.Content.ReadAsStringAsync();
                var districtJsonResult = JsonSerializer.Deserialize<DistrictResponse>(districtContent);
                var districts = districtJsonResult?.data;
                if (districtJsonResult == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);
                if (districts == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);

                var randomDistrict = districts[random.Next(districts.Count)];
                var wardResponse = await client.GetAsync($"https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id={randomDistrict.DistrictID}");
                if (!wardResponse.IsSuccessStatusCode)
                    return AppResult<Unit>.Failure($"Failed to fetch wards.", (int)wardResponse.StatusCode);
                var wardContent = await wardResponse.Content.ReadAsStringAsync();
                var wardJsonResult = JsonSerializer.Deserialize<WardResponse>(wardContent);
                var wards = wardJsonResult?.data;
                if (wardJsonResult == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);
                if (wards == null) return AppResult<Unit>.Failure($"Failed to fetch address.", 404);
                var randomWard = wards[random.Next(wards.Count)];

                var address = new Address
                {
                    UserId = user.Id,
                    FullName = user.DisplayName ?? throw new Exception("User name is null"),
                    Province = randomProvince.ProvinceName ?? throw new Exception("Province name is null"),
                    District = randomDistrict.DistrictName ?? throw new Exception("District name is null"),
                    Ward = randomWard.WardName ?? throw new Exception("Ward name is null"),
                    DetailAddress = "123/45 test " + user.DisplayName?.ToLower(),
                    PhoneNumber = "01234566789",
                    Type = AddressType.Both,
                    IsDefault = true,
                };

                _storeContext.Addresses.Add(address);
            }
            var result = await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (!result) return AppResult<Unit>.Failure("Problem when create address", 400);
            return AppResult<Unit>.Success(Unit.Value);
        }
    }
}
