import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AppComponent } from './app.component';
import { Booking, Flight, SearchRequest } from './models/flight.model';
import { FlightService } from './services/flight.service';

const mockFlight: Flight = {
  id: 'F1',
  airline: 'Sky Air',
  departureTime: '2026-08-01T08:00:00Z',
  arrivalTime: '2026-08-01T10:00:00Z',
  departureAirport: 'Delhi',
  arrivalAirport: 'Mumbai',
  price: 4500,
  stops: 0,
  availableSeats: 10,
};

describe('AppComponent', () => {
  let flightServiceMock: {
    searchFlights: (criteria: SearchRequest) => Observable<Flight[]>;
  };

  beforeEach(async () => {
    flightServiceMock = {
      searchFlights: () => of([mockFlight]),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: FlightService, useValue: flightServiceMock }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render SkyRoute title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('SkyRoute');
  });

  it('should update state on successful search', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    const criteria: SearchRequest = {
      from: 'Delhi',
      to: 'Mumbai',
      departureDate: '2026-08-20',
      passengers: 2,
      cabinClass: 'economy',
    };

    component.onSearch(criteria);

    expect(component.searchAttempted()).toBe(true);
    expect(component.lastSearchCriteria()).toEqual(criteria);
    expect(component.currentPassengerCount()).toBe(2);
    expect(component.loading()).toBe(false);
    expect(component.flights()).toEqual([mockFlight]);
  });

  it('should set connection error message when search fails with status 0', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    flightServiceMock.searchFlights = () =>
      throwError(() => ({ status: 0 }));

    const criteria: SearchRequest = {
      from: 'Delhi',
      to: 'Mumbai',
      departureDate: '2026-08-20',
      passengers: 1,
      cabinClass: 'economy',
    };

    component.onSearch(criteria);

    expect(component.loading()).toBe(false);
    expect(component.errorMessage()).toContain('Unable to connect to server');
  });

  it('should set selected flight and clear it on cancel', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    component.onFlightSelected(mockFlight);
    expect(component.selectedFlight()).toEqual(mockFlight);

    component.onBookingCancelled();
    expect(component.selectedFlight()).toBeNull();
  });

  it('should set booking confirmation and auto-hide success toast', () => {
    vi.useFakeTimers();

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    const booking: Booking = {
      bookingId: 'BK100',
      flightId: 'F1',
      passengers: [],
      totalPrice: 0,
      bookedAt: '2026-08-01T08:00:00Z',
    };

    component.onBookingSuccess(booking);

    expect(component.bookingConfirmation()).toEqual(booking);
    expect(component.bookingSuccess()).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(component.bookingSuccess()).toBe(false);

    vi.useRealTimers();
  });

  it('should fully reset state on startNewSearch', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    component.selectedFlight.set(mockFlight);
    component.bookingConfirmation.set({
      bookingId: 'BK1',
      flightId: 'F1',
      passengers: [],
      totalPrice: 1000,
      bookedAt: '2026-01-01T00:00:00Z',
    });
    component.flights.set([mockFlight]);
    component.lastSearchCriteria.set({
      from: 'Delhi',
      to: 'Mumbai',
      departureDate: '2026-10-10',
      passengers: 2,
      cabinClass: 'economy',
    });
    component.searchAttempted.set(true);
    component.currentPassengerCount.set(3);
    component.errorMessage.set('Some error');

    component.startNewSearch();

    expect(component.selectedFlight()).toBeNull();
    expect(component.bookingConfirmation()).toBeNull();
    expect(component.flights()).toEqual([]);
    expect(component.lastSearchCriteria()).toBeNull();
    expect(component.searchAttempted()).toBe(false);
    expect(component.currentPassengerCount()).toBe(1);
    expect(component.errorMessage()).toBe('');
  });
});
