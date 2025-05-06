using System;

namespace API.DTOs;

public class AddressDataModel
{
    public DateTime LastUpdated { get; set; }
    public List<Province> Provinces { get; set; } = [];
    public Dictionary<string, List<District>> DistrictsByProvince { get; set; } = [];
    public Dictionary<string, List<Ward>> WardsByDistrict { get; set; } = [];
}
