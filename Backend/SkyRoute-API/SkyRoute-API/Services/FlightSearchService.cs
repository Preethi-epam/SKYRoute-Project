using SkyRoute_API.Domain;
using SkyRoute_API.Models;
using SkyRoute_API.Providers;

namespace SkyRoute_API.Services;

public class FlightSearchService : IFlightSearchService
{
    private readonly IEnumerable<IAirlineProvider> _providers;

    public FlightSearchService(IEnumerable<IAirlineProvider> providers)
    {
        _providers = providers;
    }

    public async Task<IEnumerable<FlightDto>> SearchFlightsAsync(SearchRequestDto request, CancellationToken cancellationToken = default)
    {
        var criteria = new SearchCriteria
        {
            From = request.From,
            To = request.To,
            DepartureDate = DateTime.Parse(request.DepartureDate),
            Passengers = request.Passengers,
            CabinClass = request.CabinClass
        };

        var tasks = _providers.Select(provider => provider.SearchFlightsAsync(criteria, cancellationToken));
        var results = await Task.WhenAll(tasks);

        var allFlights = results.SelectMany(flights => flights)
            .Where(f => f.AvailableSeats >= request.Passengers)
            .Select(MapToDto)
            .OrderBy(f => f.Price)
            .ToList();

        return allFlights;
    }

    private static FlightDto MapToDto(Flight flight)
    {
        return new FlightDto
        {
            Id = flight.Id,
            Airline = flight.Airline,
            DepartureTime = flight.DepartureTime.ToString("O"),
            ArrivalTime = flight.ArrivalTime.ToString("O"),
            DepartureAirport = flight.DepartureAirport,
            ArrivalAirport = flight.ArrivalAirport,
            Price = flight.Price,
            Stops = flight.Stops,
            AvailableSeats = flight.AvailableSeats
        };
    }
}
