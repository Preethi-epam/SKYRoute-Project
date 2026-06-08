import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Flight, Passenger, Booking } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';
import { AIRPORT_COUNTRY_MAP } from '../../config/app.constants';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  @Input() flight!: Flight;
  @Input() passengerCount: number = 1;
  @Output() cancelled = new EventEmitter<void>();
  @Output() booked = new EventEmitter<Booking>();

  isBooking = signal(false);
  errorMessage = signal('');

  private flightService = inject(FlightService);
  private airportCountryMap: Record<string, string> = AIRPORT_COUNTRY_MAP;

  passengers: Passenger[] = this.createEmptyPassengers(9);

  get isInternationalFlight(): boolean {
    const departureCountry = this.getCountryForAirport(this.flight?.departureAirport);
    const arrivalCountry = this.getCountryForAirport(this.flight?.arrivalAirport);

    if (!departureCountry || !arrivalCountry) {
      return false;
    }

    return departureCountry !== arrivalCountry;
  }

  get documentLabel(): string {
    return this.isInternationalFlight ? 'Passport Number' : 'National ID';
  }

  get documentPlaceholder(): string {
    return this.isInternationalFlight ? 'e.g. A1234567' : 'e.g. 123456789012';
  }

  getPassengerRange(): number[] {
    return Array.from({ length: this.passengerCount }, (_, i) => i);
  }

  get totalPrice(): number {
    return this.flight.price * this.passengerCount;
  }

  isFormValid(): boolean {
    const validPassengers = this.passengers
      .slice(0, this.passengerCount)
      .every(
        (p) =>
          p.name.trim().length > 0 &&
          this.isEmailValid(p.email) &&
          this.isDocumentNumberValid(p.documentNumber)
      );
    return validPassengers;
  }

  isDocumentNumberValid(documentNumber: string): boolean {
    const value = documentNumber?.trim() ?? '';
    if (!value) {
      return false;
    }

    if (this.isInternationalFlight) {
      return /^[A-Za-z0-9]{6,9}$/.test(value);
    }

    return /^\d{12}$/.test(value);
  }

  getDocumentValidationHint(): string {
    return this.isInternationalFlight
      ? 'Passport Number must be 6-9 alphanumeric characters.'
      : 'National ID must be exactly 12 digits.';
  }

  onConfirmBooking() {
    if (!this.isFormValid()) {
      this.errorMessage.set('Please fill in all passenger details');
      return;
    }

    this.isBooking.set(true);
    this.errorMessage.set('');

    const validPassengers = this.passengers.slice(0, this.passengerCount);

    this.flightService.bookFlight(this.flight.id, validPassengers).subscribe({
      next: (booking) => {
        this.isBooking.set(false);
        this.booked.emit(booking);
      },
      error: (error) => {
        this.isBooking.set(false);
        this.errorMessage.set(
          error.error?.message || 'Booking failed. Please try again.'
        );
      },
    });
  }

  onCancel() {
    this.cancelled.emit();
  }

  private isEmailValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? '');
  }

  private getCountryForAirport(airport: string | undefined): string | null {
    if (!airport) {
      return null;
    }

    return this.airportCountryMap[airport] ?? null;
  }

  private createEmptyPassengers(count: number): Passenger[] {
    return Array.from({ length: count }, () => ({
      name: '',
      email: '',
      documentNumber: '',
    }));
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
