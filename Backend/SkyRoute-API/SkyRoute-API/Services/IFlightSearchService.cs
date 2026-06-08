using SkyRoute_API.Domain;
using SkyRoute_API.Models;

namespace SkyRoute_API.Services;

public interface IFlightSearchService
{
    Task<IEnumerable<FlightDto>> SearchFlightsAsync(SearchRequestDto request, CancellationToken cancellationToken = default);
}
