using SkyRoute_API.Domain;

namespace SkyRoute_API.Providers;

public class BudgetWingsProvider : IAirlineProvider
{
    public string ProviderName => "BudgetWings Airways";

    private const decimal MinimumPrice = 2499m;

    private decimal CalculatePrice(decimal baseFare)
    {
        var discountedPrice = baseFare * 0.90m; 
        return Math.Max(discountedPrice, MinimumPrice);
    }

    // Static flight schedule with predefined routes
    private static readonly List<FlightTemplate> FlightSchedule = new()
    {
        // Delhi to Mumbai routes
        new FlightTemplate { Id = "BW-D101", From = "Delhi", To = "Mumbai", DepartureHour = 5, DurationHours = 2.5, Stops = 0, EconomyBase = 7999m, BusinessBase = 21999m, FirstBase = 44999m, Seats = 186 },
        new FlightTemplate { Id = "BW-D102", From = "Delhi", To = "Mumbai", DepartureHour = 10, DurationHours = 2.5, Stops = 0, EconomyBase = 8499m, BusinessBase = 23999m, FirstBase = 47999m, Seats = 186 },
        new FlightTemplate { Id = "BW-D103", From = "Delhi", To = "Mumbai", DepartureHour = 15, DurationHours = 4, Stops = 1, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 162 },
        new FlightTemplate { Id = "BW-D104", From = "Delhi", To = "Mumbai", DepartureHour = 19, DurationHours = 2.5, Stops = 0, EconomyBase = 9999m, BusinessBase = 27999m, FirstBase = 54999m, Seats = 186 },
        new FlightTemplate { Id = "BW-D105", From = "Delhi", To = "Mumbai", DepartureHour = 22, DurationHours = 5, Stops = 2, EconomyBase = 5999m, BusinessBase = 17999m, FirstBase = 34999m, Seats = 162 },

        // Mumbai to Delhi routes
        new FlightTemplate { Id = "BW-M201", From = "Mumbai", To = "Delhi", DepartureHour = 6, DurationHours = 2.5, Stops = 0, EconomyBase = 7999m, BusinessBase = 21999m, FirstBase = 44999m, Seats = 186 },
        new FlightTemplate { Id = "BW-M202", From = "Mumbai", To = "Delhi", DepartureHour = 11, DurationHours = 2.5, Stops = 0, EconomyBase = 8499m, BusinessBase = 23999m, FirstBase = 47999m, Seats = 186 },
        new FlightTemplate { Id = "BW-M203", From = "Mumbai", To = "Delhi", DepartureHour = 17, DurationHours = 4, Stops = 1, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 162 },
        new FlightTemplate { Id = "BW-M204", From = "Mumbai", To = "Delhi", DepartureHour = 21, DurationHours = 5, Stops = 2, EconomyBase = 5999m, BusinessBase = 17999m, FirstBase = 34999m, Seats = 162 },

        // Bangalore to Delhi routes
        new FlightTemplate { Id = "BW-B301", From = "Bengaluru", To = "Delhi", DepartureHour = 4, DurationHours = 3, Stops = 0, EconomyBase = 10999m, BusinessBase = 31999m, FirstBase = 64999m, Seats = 186 },
        new FlightTemplate { Id = "BW-B302", From = "Bengaluru", To = "Delhi", DepartureHour = 10, DurationHours = 3, Stops = 0, EconomyBase = 11999m, BusinessBase = 33999m, FirstBase = 67999m, Seats = 186 },
        new FlightTemplate { Id = "BW-B303", From = "Bengaluru", To = "Delhi", DepartureHour = 19, DurationHours = 4.5, Stops = 1, EconomyBase = 8999m, BusinessBase = 26999m, FirstBase = 54999m, Seats = 162 },

        // Delhi to Bangalore routes
        new FlightTemplate { Id = "BW-D401", From = "Delhi", To = "Bengaluru", DepartureHour = 5, DurationHours = 3, Stops = 0, EconomyBase = 10999m, BusinessBase = 31999m, FirstBase = 64999m, Seats = 186 },
        new FlightTemplate { Id = "BW-D402", From = "Delhi", To = "Bengaluru", DepartureHour = 12, DurationHours = 3, Stops = 0, EconomyBase = 11999m, BusinessBase = 33999m, FirstBase = 67999m, Seats = 186 },
        new FlightTemplate { Id = "BW-D403", From = "Delhi", To = "Bengaluru", DepartureHour = 21, DurationHours = 4.5, Stops = 1, EconomyBase = 8999m, BusinessBase = 26999m, FirstBase = 54999m, Seats = 162 },

        // Mumbai to Bangalore Mumbai
        new FlightTemplate { Id = "BW-M501", From = "Mumbai", To = "Bengaluru", DepartureHour = 7, DurationHours = 1.5, Stops = 0, EconomyBase = 6499m, BusinessBase = 17999m, FirstBase = 36999m, Seats = 186 },
        new FlightTemplate { Id = "BW-M502", From = "Mumbai", To = "Bengaluru", DepartureHour = 14, DurationHours = 1.5, Stops = 0, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 186 },
        new FlightTemplate { Id = "BW-M503", From = "Mumbai", To = "Bengaluru", DepartureHour = 20, DurationHours = 1.5, Stops = 0, EconomyBase = 7499m, BusinessBase = 20999m, FirstBase = 41999m, Seats = 186 },

        // Bangalore to Mumbai routes
        new FlightTemplate { Id = "BW-B601", From = "Bengaluru", To = "Mumbai", DepartureHour = 6, DurationHours = 1.5, Stops = 0, EconomyBase = 6499m, BusinessBase = 17999m, FirstBase = 36999m, Seats = 186 },
        new FlightTemplate { Id = "BW-B602", From = "Bengaluru", To = "Mumbai", DepartureHour = 16, DurationHours = 1.5, Stops = 0, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 186 },
        new FlightTemplate { Id = "BW-B603", From = "Bengaluru", To = "Mumbai", DepartureHour = 22, DurationHours = 1.5, Stops = 0, EconomyBase = 7499m, BusinessBase = 20999m, FirstBase = 41999m, Seats = 186 },

        // US Routes - New York to Los Angeles
        new FlightTemplate { Id = "BW-US701", From = "NewYork", To = "LosAngeles", DepartureHour = 6, DurationHours = 6, Stops = 0, EconomyBase = 21999m, BusinessBase = 66999m, FirstBase = 133999m, Seats = 195 },
        new FlightTemplate { Id = "BW-US702", From = "NewYork", To = "LosAngeles", DepartureHour = 12, DurationHours = 6, Stops = 0, EconomyBase = 23999m, BusinessBase = 71999m, FirstBase = 143999m, Seats = 195 },
        new FlightTemplate { Id = "BW-US703", From = "NewYork", To = "LosAngeles", DepartureHour = 18, DurationHours = 7.5, Stops = 1, EconomyBase = 18999m, BusinessBase = 57999m, FirstBase = 115999m, Seats = 170 },

        // International  Routes - India  to US
        new FlightTemplate { Id = "BW-801", From = "Delhi", To = "NewYork", DepartureHour = 5, DurationHours = 5.5, Stops = 0, EconomyBase = 21999m, BusinessBase = 66999m, FirstBase = 133999m, Seats = 195 },
        new FlightTemplate { Id = "BW-802", From = "Delhi", To = "LosAngeles", DepartureHour = 11, DurationHours = 5.5, Stops = 0, EconomyBase = 23999m, BusinessBase = 71999m, FirstBase = 143999m, Seats = 195 },
        new FlightTemplate { Id = "BW-803", From = "Bengaluru", To = "NewYork", DepartureHour = 20, DurationHours = 7, Stops = 1, EconomyBase = 18999m, BusinessBase = 57999m, FirstBase = 115999m, Seats = 170 },
    };

    public Task<IEnumerable<Flight>> SearchFlightsAsync(SearchCriteria criteria, CancellationToken cancellationToken = default)
    {
        // Filter flights based on From and To airports
        var matchingFlights = FlightSchedule
            .Where(ft => ft.From.Equals(criteria.From, StringComparison.OrdinalIgnoreCase) &&
                        ft.To.Equals(criteria.To, StringComparison.OrdinalIgnoreCase))
            .Select(ft => CreateFlightFromTemplate(ft, criteria))
            .ToList();

        return Task.FromResult<IEnumerable<Flight>>(matchingFlights);
    }

    private Flight CreateFlightFromTemplate(FlightTemplate template, SearchCriteria criteria)
    {
        // Select base fare based on cabin class
        var baseFare = criteria.CabinClass.ToLower() switch
        {
            "economy" => template.EconomyBase,
            "business" => template.BusinessBase,
            "first" => template.FirstBase,
            _ => template.EconomyBase
        };

        var departureTime = criteria.DepartureDate.Date.AddHours(template.DepartureHour);
        var arrivalTime = departureTime.AddHours(template.DurationHours);

        return new Flight
        {
            Id = template.Id,
            Airline = ProviderName,
            DepartureTime = departureTime,
            ArrivalTime = arrivalTime,
            DepartureAirport = template.From,
            ArrivalAirport = template.To,
            Price = CalculatePrice(baseFare),
            Stops = template.Stops,
            AvailableSeats = template.Seats,
            CabinClass = criteria.CabinClass
        };
    }

    public Task<Flight?> GetFlightByIdAsync(string flightId, CancellationToken cancellationToken = default)
    {
        if (!flightId.StartsWith("BW-"))
            return Task.FromResult<Flight?>(null);

        var template = FlightSchedule.FirstOrDefault(ft => ft.Id == flightId);
        if (template == null)
            return Task.FromResult<Flight?>(null);

        var criteria = new SearchCriteria
        {
            From = template.From,
            To = template.To,
            DepartureDate = DateTime.UtcNow.Date.AddDays(1),
            Passengers = 1,
            CabinClass = "economy"
        };

        var flight = CreateFlightFromTemplate(template, criteria);
        return Task.FromResult<Flight?>(flight);
    }

    // Helper class to define flight templates
    private class FlightTemplate
    {
        public required string Id { get; set; }
        public required string From { get; set; }
        public required string To { get; set; }
        public required int DepartureHour { get; set; }
        public required double DurationHours { get; set; }
        public required int Stops { get; set; }
        public required decimal EconomyBase { get; set; }
        public required decimal BusinessBase { get; set; }
        public required decimal FirstBase { get; set; }
        public required int Seats { get; set; }
    }
}
