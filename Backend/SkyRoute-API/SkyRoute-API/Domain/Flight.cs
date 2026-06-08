namespace SkyRoute_API.Domain;

public class Flight
{
    public required string Id { get; set; }
    public required string Airline { get; set; }
    public required DateTime DepartureTime { get; set; }
    public required DateTime ArrivalTime { get; set; }
    public required string DepartureAirport { get; set; }
    public required string ArrivalAirport { get; set; }
    public required decimal Price { get; set; }
    public required int Stops { get; set; }
    public required int AvailableSeats { get; set; }
    public required string CabinClass { get; set; }
}
