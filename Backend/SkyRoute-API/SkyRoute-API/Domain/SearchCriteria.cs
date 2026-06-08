namespace SkyRoute_API.Domain;

public class SearchCriteria
{
    public required string From { get; set; }
    public required string To { get; set; }
    public required DateTime DepartureDate { get; set; }
    public required int Passengers { get; set; }
    public required string CabinClass { get; set; }
}
