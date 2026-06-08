using Microsoft.AspNetCore.Mvc;
using SkyRoute_API.Models;
using SkyRoute_API.Services;

namespace SkyRoute_API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ILogger<BookingsController> _logger;

    public BookingsController(IBookingService bookingService, ILogger<BookingsController> logger)
    {
        _bookingService = bookingService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking(
        [FromBody] BookingRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.FlightId))
            {
                return BadRequest("FlightId is required");
            }

            if (request.Passengers == null || !request.Passengers.Any())
            {
                return BadRequest("At least one passenger is required");
            }

            foreach (var passenger in request.Passengers)
            {
                if (string.IsNullOrWhiteSpace(passenger.Name) ||
                    string.IsNullOrWhiteSpace(passenger.Email) ||
                    string.IsNullOrWhiteSpace(passenger.DocumentNumber))
                {
                    return BadRequest("All passenger fields (Name, Email, DocumentNumber) are required");
                }
            }

            var booking = await _bookingService.CreateBookingAsync(request, cancellationToken);
            return CreatedAtAction(nameof(CreateBooking), new { id = booking.BookingId }, booking);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid booking request");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating booking");
            return StatusCode(500, "An error occurred while creating the booking");
        }
    }
}
