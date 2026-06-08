using SkyRoute_API.Domain;

namespace SkyRoute_API.Providers;

public class GlobalAirProvider : IAirlineProvider
{
    public string ProviderName => "GlobalAir Airlines";

    private decimal CalculatePrice(decimal baseFare)
    {
        var finalPrice = baseFare * 1.15m; 
        return Math.Round(finalPrice, 2); 
    }

    // Static flight schedule with predefined routes
    private static readonly List<FlightTemplate> FlightSchedule = new()
    {
        // Delhi to Mumbai routes
        new FlightTemplate { Id = "GA-101", From = "Delhi", To = "Mumbai", DepartureHour = 6, DurationHours = 2.5, Stops = 0, EconomyBase = 8999m, BusinessBase = 24999m, FirstBase = 49999m, Seats = 180 },
        new FlightTemplate { Id = "GA-102", From = "Delhi", To = "Mumbai", DepartureHour = 9, DurationHours = 2.5, Stops = 0, EconomyBase = 9499m, BusinessBase = 26999m, FirstBase = 52999m, Seats = 180 },
        new FlightTemplate { Id = "GA-103", From = "Delhi", To = "Mumbai", DepartureHour = 14, DurationHours = 3.5, Stops = 1, EconomyBase = 7999m, BusinessBase = 22999m, FirstBase = 44999m, Seats = 156 },
        new FlightTemplate { Id = "GA-104", From = "Delhi", To = "Mumbai", DepartureHour = 18, DurationHours = 2.5, Stops = 0, EconomyBase = 10999m, BusinessBase = 29999m, FirstBase = 59999m, Seats = 180 },

        // Mumbai to Delhi routes
        new FlightTemplate { Id = "GA-201", From = "Mumbai", To = "Delhi", DepartureHour = 7, DurationHours = 2.5, Stops = 0, EconomyBase = 8999m, BusinessBase = 24999m, FirstBase = 49999m, Seats = 180 },
        new FlightTemplate { Id = "GA-202", From = "Mumbai", To = "Delhi", DepartureHour = 12, DurationHours = 2.5, Stops = 0, EconomyBase = 9499m, BusinessBase = 26999m, FirstBase = 52999m, Seats = 180 },
        new FlightTemplate { Id = "GA-203", From = "Mumbai", To = "Delhi", DepartureHour = 16, DurationHours = 3.5, Stops = 1, EconomyBase = 7999m, BusinessBase = 22999m, FirstBase = 44999m, Seats = 156 },

        // Bangalore to Delhi Delhi
        new FlightTemplate { Id = "GA-301", From = "Bengaluru", To = "Delhi", DepartureHour = 5, DurationHours = 3, Stops = 0, EconomyBase = 11999m, BusinessBase = 34999m, FirstBase = 69999m, Seats = 180 },
        new FlightTemplate { Id = "GA-302", From = "Bengaluru", To = "Delhi", DepartureHour = 11, DurationHours = 3, Stops = 0, EconomyBase = 12999m, BusinessBase = 36999m, FirstBase = 72999m, Seats = 180 },
        new FlightTemplate { Id = "GA-303", From = "Bengaluru", To = "Delhi", DepartureHour = 20, DurationHours = 4, Stops = 1, EconomyBase = 9999m, BusinessBase = 29999m, FirstBase = 59999m, Seats = 156 },

        // Delhi to Bangalore routes
        new FlightTemplate { Id = "GA-401", From = "Delhi", To = "Bengaluru", DepartureHour = 6, DurationHours = 3, Stops = 0, EconomyBase = 11999m, BusinessBase = 34999m, FirstBase = 69999m, Seats = 180 },
        new FlightTemplate { Id = "GA-402", From = "Delhi", To = "Bengaluru", DepartureHour = 13, DurationHours = 3, Stops = 0, EconomyBase = 12999m, BusinessBase = 36999m, FirstBase = 72999m, Seats = 180 },

        // Mumbai to Bangalore routes
        new FlightTemplate { Id = "GA-501", From = "Mumbai", To = "Bengaluru", DepartureHour = 8, DurationHours = 1.5, Stops = 0, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 180 },
        new FlightTemplate { Id = "GA-502", From = "Mumbai", To = "Bengaluru", DepartureHour = 15, DurationHours = 1.5, Stops = 0, EconomyBase = 7499m, BusinessBase = 21999m, FirstBase = 42999m, Seats = 180 },

        // Bangalore to Mumbai routes
        new FlightTemplate { Id = "GA-601", From = "Bengaluru", To = "Mumbai", DepartureHour = 7, DurationHours = 1.5, Stops = 0, EconomyBase = 6999m, BusinessBase = 19999m, FirstBase = 39999m, Seats = 180 },
        new FlightTemplate { Id = "GA-602", From = "Bengaluru", To = "Mumbai", DepartureHour = 17, DurationHours = 1.5, Stops = 0, EconomyBase = 7499m, BusinessBase = 21999m, FirstBase = 42999m, Seats = 180 },

        // US Routes - New York to Los Angeles
        new FlightTemplate { Id = "GA-701", From = "NewYork", To = "LosAngeles", DepartureHour = 8, DurationHours = 6, Stops = 0, EconomyBase = 24999m, BusinessBase = 74999m, FirstBase = 149999m, Seats = 200 },
        new FlightTemplate { Id = "GA-702", From = "NewYork", To = "LosAngeles", DepartureHour = 14, DurationHours = 6, Stops = 0, EconomyBase = 27999m, BusinessBase = 82999m, FirstBase = 164999m, Seats = 200 },

        // US Routes - Los Angeles to New York
        new FlightTemplate { Id = "GA-801", From = "LosAngeles", To = "NewYork", DepartureHour = 7, DurationHours = 5.5, Stops = 0, EconomyBase = 24999m, BusinessBase = 74999m, FirstBase = 149999m, Seats = 200 },
        new FlightTemplate { Id = "GA-802", From = "LosAngeles", To = "NewYork", DepartureHour = 13, DurationHours = 5.5, Stops = 0, EconomyBase = 27999m, BusinessBase = 82999m, FirstBase = 164999m, Seats = 200 },
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
        if (!flightId.StartsWith("GA-"))
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
