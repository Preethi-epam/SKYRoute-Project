using SkyRoute_API.Domain;
using SkyRoute_API.Models;
using SkyRoute_API.Providers;

namespace SkyRoute_API.Services;

public class BookingService : IBookingService
{
    private readonly IEnumerable<IAirlineProvider> _providers;
    private static readonly List<Booking> _bookings = new();

    public BookingService(IEnumerable<IAirlineProvider> providers)
    {
        _providers = providers;
    }

    public async Task<BookingDto> CreateBookingAsync(BookingRequestDto request, CancellationToken cancellationToken = default)
    {

        var flight = await GetFlightFromProvidersAsync(request.FlightId, cancellationToken);

        if (flight == null)
        {
            throw new InvalidOperationException($"Flight {request.FlightId} not found");
        }

        if (flight.AvailableSeats < request.Passengers.Count)
        {
            throw new InvalidOperationException($"Not enough seats available. Requested: {request.Passengers.Count}, Available: {flight.AvailableSeats}");
        }

        var booking = new Booking
        {
            BookingId = $"BK-{Guid.NewGuid().ToString()[..12].ToUpper()}",
            FlightId = request.FlightId,
            Passengers = request.Passengers.Select(p => new Passenger
            {
                Name = p.Name,
                Email = p.Email,
                DocumentNumber = p.DocumentNumber
            }).ToList(),
            TotalPrice = flight.Price * request.Passengers.Count,
            BookedAt = DateTime.UtcNow
        };

        _bookings.Add(booking);


        return MapToDto(booking);
    }

    private async Task<Flight?> GetFlightFromProvidersAsync(string flightId, CancellationToken cancellationToken)
    {
        foreach (var provider in _providers)
        {
            var flight = await provider.GetFlightByIdAsync(flightId, cancellationToken);
            if (flight != null)
                return flight;
        }
        return null;
    }

    private static BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            BookingId = booking.BookingId,
            FlightId = booking.FlightId,
            Passengers = booking.Passengers.Select(p => new PassengerDto
            {
                Name = p.Name,
                Email = p.Email,
                DocumentNumber = p.DocumentNumber
            }).ToList(),
            TotalPrice = booking.TotalPrice,
            BookedAt = booking.BookedAt.ToString("O")
        };
    }
}
