using SkyRoute_API.Models;

namespace SkyRoute_API.Services;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(BookingRequestDto request, CancellationToken cancellationToken = default);
}
