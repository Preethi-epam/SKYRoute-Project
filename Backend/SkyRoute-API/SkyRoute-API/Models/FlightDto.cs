namespace SkyRoute_API.Models;

public class FlightDto
{
    public required string Id { get; set; }
    public required string Airline { get; set; }
    public required string DepartureTime { get; set; }
    public required string ArrivalTime { get; set; }
    public required string DepartureAirport { get; set; }
    public required string ArrivalAirport { get; set; }
    public required decimal Price { get; set; }
    public required int Stops { get; set; }
    public required int AvailableSeats { get; set; }
}
