namespace SkyRoute_API.Models;

public class BookingDto
{
    public required string BookingId { get; set; }
    public required string FlightId { get; set; }
    public required List<PassengerDto> Passengers { get; set; }
    public required decimal TotalPrice { get; set; }
    public required string BookedAt { get; set; }
}
