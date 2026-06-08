namespace SkyRoute_API.Domain;

public class Booking
{
    public required string BookingId { get; set; }
    public required string FlightId { get; set; }
    public required List<Passenger> Passengers { get; set; }
    public required decimal TotalPrice { get; set; }
    public required DateTime BookedAt { get; set; }
}
