import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BookingComponent } from './booking.component';
import { FlightService } from '../../services/flight.service';
import { Booking, Flight } from '../../models/flight.model';

const domesticFlight: Flight = {
  id: 'F-DOM',
  airline: 'Domestic Air',
  departureTime: '2026-07-01T08:00:00Z',
  arrivalTime: '2026-07-01T10:00:00Z',
  departureAirport: 'Delhi',
  arrivalAirport: 'Mumbai',
  price: 5000,
  stops: 0,
  availableSeats: 20,
};

const internationalFlight: Flight = {
  ...domesticFlight,
  id: 'F-INT',
  departureAirport: 'Delhi',
  arrivalAirport: 'NewYork',
};

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let flightServiceMock: { bookFlight: (flightId: string, passengers: any[]) => any };

  beforeEach(async () => {
    flightServiceMock = {
      bookFlight: () => of({} as Booking),
    };

    await TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [{ provide: FlightService, useValue: flightServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    component.flight = domesticFlight;
    component.passengerCount = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify domestic and international flights correctly', () => {
    component.flight = domesticFlight;
    expect(component.isInternationalFlight).toBe(false);

    component.flight = internationalFlight;
    expect(component.isInternationalFlight).toBe(true);
  });

  it('should return correct document label and placeholder for international flight', () => {
    component.flight = internationalFlight;

    expect(component.documentLabel).toBe('Passport Number');
    expect(component.documentPlaceholder).toContain('A1234567');
  });

  it('should validate domestic national ID exactly 12 digits', () => {
    component.flight = domesticFlight;

    expect(component.isDocumentNumberValid('123456789012')).toBe(true);
    expect(component.isDocumentNumberValid('12345678901')).toBe(false);
    expect(component.isDocumentNumberValid('1234abcd9012')).toBe(false);
    expect(component.isDocumentNumberValid('')).toBe(false);
  });

  it('should validate international passport number 6-9 alphanumeric chars', () => {
    component.flight = internationalFlight;

    expect(component.isDocumentNumberValid('A12345')).toBe(true);
    expect(component.isDocumentNumberValid('AB1234567')).toBe(true);
    expect(component.isDocumentNumberValid('ABC12345678')).toBe(false);
    expect(component.isDocumentNumberValid('AB_1234')).toBe(false);
  });

  it('should calculate total price based on passenger count', () => {
    component.flight = domesticFlight;
    component.passengerCount = 3;

    expect(component.totalPrice).toBe(15000);
  });

  it('should validate form for selected passenger count only', () => {
    component.passengerCount = 2;
    component.flight = domesticFlight;

    component.passengers[0] = {
      name: 'John',
      email: 'john@example.com',
      documentNumber: '123456789012',
    };
    component.passengers[1] = {
      name: 'Jane',
      email: 'jane@example.com',
      documentNumber: '123456789012',
    };
    component.passengers[2] = {
      name: '',
      email: 'bad',
      documentNumber: '',
    };

    expect(component.isFormValid()).toBe(true);
  });

  it('should set error and skip service call when form is invalid', () => {
    let called = false;
    flightServiceMock.bookFlight = () => {
      called = true;
      return of({} as Booking);
    };

    component.passengers[0] = {
      name: '',
      email: 'invalid-email',
      documentNumber: '123',
    };

    component.onConfirmBooking();

    expect(called).toBe(false);
    expect(component.errorMessage()).toBe('Please fill in all passenger details');
  });

  it('should emit booked event on successful booking', () => {
    const bookingResponse: Booking = {
      bookingId: 'BK1',
      flightId: domesticFlight.id,
      passengers: [
        {
          name: 'John',
          email: 'john@example.com',
          documentNumber: '123456789012',
        },
      ],
      totalPrice: 5000,
      bookedAt: '2026-06-01T10:00:00Z',
    };

    flightServiceMock.bookFlight = () => of(bookingResponse);

    component.passengers[0] = {
      name: 'John',
      email: 'john@example.com',
      documentNumber: '123456789012',
    };

    let emitted: Booking | null = null;
    component.booked.subscribe((booking) => {
      emitted = booking;
    });

    component.onConfirmBooking();

    expect(component.isBooking()).toBe(false);
    expect(emitted).toEqual(bookingResponse);
  });

  it('should handle booking API error', () => {
    flightServiceMock.bookFlight = () =>
      throwError(() => ({ error: { message: 'Seat unavailable' } }));

    component.passengers[0] = {
      name: 'John',
      email: 'john@example.com',
      documentNumber: '123456789012',
    };

    component.onConfirmBooking();

    expect(component.isBooking()).toBe(false);
    expect(component.errorMessage()).toBe('Seat unavailable');
  });

  it('should emit cancelled event', () => {
    let cancelled = false;
    component.cancelled.subscribe(() => {
      cancelled = true;
    });

    component.onCancel();

    expect(cancelled).toBe(true);
  });
});
