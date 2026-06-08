import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FlightService } from './flight.service';
import { SearchRequest } from '../models/flight.model';
import { environment } from '../../environments/environment';

describe('FlightService', () => {
  let service: FlightService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(FlightService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should POST search request to flights search endpoint', () => {
    const request: SearchRequest = {
      from: 'Delhi',
      to: 'Mumbai',
      departureDate: '2026-10-10',
      passengers: 2,
      cabinClass: 'economy',
    };

    const response = [
      {
        id: 'F1',
        airline: 'Sky Air',
        departureTime: '2026-10-10T06:00:00Z',
        arrivalTime: '2026-10-10T08:00:00Z',
        departureAirport: 'Delhi',
        arrivalAirport: 'Mumbai',
        price: 5000,
        stops: 0,
        availableSeats: 10,
      },
    ];

    service.searchFlights(request).subscribe((flights) => {
      expect(flights).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/flights/search`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(response);
  });

  it('should POST booking request to bookings endpoint', () => {
    const passengers = [
      {
        name: 'John',
        email: 'john@example.com',
        documentNumber: '123456789012',
      },
    ];

    const bookingResponse = {
      bookingId: 'BK-101',
      flightId: 'F1',
      passengers,
      totalPrice: 5000,
      bookedAt: '2026-06-01T10:00:00Z',
    };

    service.bookFlight('F1', passengers).subscribe((booking) => {
      expect(booking).toEqual(bookingResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/bookings`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      flightId: 'F1',
      passengers,
    });
    req.flush(bookingResponse);
  });
});
