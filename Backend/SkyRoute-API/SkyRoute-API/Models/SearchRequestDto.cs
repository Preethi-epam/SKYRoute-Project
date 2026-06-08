namespace SkyRoute_API.Models;

public class SearchRequestDto
{
    public required string From { get; set; }
    public required string To { get; set; }
    public required string DepartureDate { get; set; }
    public required int Passengers { get; set; }
    public required string CabinClass { get; set; } 
}
