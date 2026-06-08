namespace SkyRoute_API.Models;

public class BookingRequestDto
{
    public required string FlightId { get; set; }
    public required List<PassengerDto> Passengers { get; set; }
}
