using Microsoft.AspNetCore.Mvc;
using SkyRoute_API.Models;
using SkyRoute_API.Services;

namespace SkyRoute_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly IFlightSearchService _flightSearchService;
    private readonly ILogger<FlightsController> _logger;

    public FlightsController(IFlightSearchService flightSearchService, ILogger<FlightsController> logger)
    {
        _flightSearchService = flightSearchService;
        _logger = logger;
    }

    [HttpPost("search")]
    public async Task<ActionResult<IEnumerable<FlightDto>>> SearchFlights(
        [FromBody] SearchRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.From) || string.IsNullOrWhiteSpace(request.To))
            {
                return BadRequest("From and To airports are required");
            }

            if (request.Passengers <= 0)
            {
                return BadRequest("Number of passengers must be greater than 0");
            }

            var flights = await _flightSearchService.SearchFlightsAsync(request, cancellationToken);
            return Ok(flights);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching flights");
            return StatusCode(500, "An error occurred while searching flights");
        }
    }
}
