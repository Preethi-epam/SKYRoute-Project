import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Flight,
  SearchRequest,
  Booking,
  Passenger,
  BookingRequest,
} from '../models/flight.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  searchFlights(request: SearchRequest): Observable<Flight[]> {
    return this.http.post<Flight[]>(`${this.apiUrl}/flights/search`, request);
  }

  bookFlight(flightId: string, passengers: Passenger[]): Observable<Booking> {
    const bookingRequest: BookingRequest = {
      flightId,
      passengers,
    };
    return this.http.post<Booking>(
      `${this.apiUrl}/bookings`,
      bookingRequest
    );
  }
}
