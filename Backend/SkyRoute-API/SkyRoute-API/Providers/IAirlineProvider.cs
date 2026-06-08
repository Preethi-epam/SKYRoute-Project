using SkyRoute_API.Domain;

namespace SkyRoute_API.Providers;

public interface IAirlineProvider
{
    string ProviderName { get; }
    Task<IEnumerable<Flight>> SearchFlightsAsync(SearchCriteria criteria, CancellationToken cancellationToken = default);
    Task<Flight?> GetFlightByIdAsync(string flightId, CancellationToken cancellationToken = default);
}
