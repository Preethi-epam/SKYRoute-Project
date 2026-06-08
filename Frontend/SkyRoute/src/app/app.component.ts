import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { BookingComponent } from './components/booking/booking.component';
import { Flight, SearchRequest, Booking } from './models/flight.model';
import { FlightService } from './services/flight.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SearchComponent,
    ResultsComponent,
    BookingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private flightService = inject(FlightService);

  flights = signal<Flight[]>([]);
  loading = signal(false);
  selectedFlight = signal<Flight | null>(null);
  bookingConfirmation = signal<Booking | null>(null);
  errorMessage = signal('');
  bookingSuccess = signal(false);
  currentPassengerCount = signal(1);
  lastSearchCriteria = signal<SearchRequest | null>(null);
  searchAttempted = signal(false);

  onSearch(criteria: SearchRequest) {
    this.searchAttempted.set(true);
    this.lastSearchCriteria.set(criteria);
    this.loading.set(true);
    this.errorMessage.set('');
    this.currentPassengerCount.set(criteria.passengers);

    this.flightService.searchFlights(criteria).subscribe({
      next: (flights) => {
        this.flights.set(flights);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Search error:', error);
        this.loading.set(false);
        this.errorMessage.set(
          error.status === 0
            ? 'Unable to connect to server. Please ensure the backend is running'
            : 'Search failed. Please try again.'
        );
      },
    });
  }

  onFlightSelected(flight: Flight) {
    this.selectedFlight.set(flight);
  }

  onBookingCancelled() {
    this.selectedFlight.set(null);
  }

  onBookingSuccess(booking: Booking) {
    this.bookingConfirmation.set(booking);
    this.bookingSuccess.set(true);
    setTimeout(() => this.bookingSuccess.set(false), 3000);
  }

  startNewSearch() {
    this.selectedFlight.set(null);
    this.bookingConfirmation.set(null);
    this.flights.set([]);
    this.lastSearchCriteria.set(null);
    this.searchAttempted.set(false);
    this.currentPassengerCount.set(1);
    this.errorMessage.set('');
  }

  clearError() {
    this.errorMessage.set('');
  }
}
