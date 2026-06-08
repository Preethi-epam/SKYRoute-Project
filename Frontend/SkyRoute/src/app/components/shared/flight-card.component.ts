import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.css',
})
export class FlightCardComponent {
  @Input() flight!: Flight;
  @Output() selected = new EventEmitter<Flight>();

  onSelect() {
    this.selected.emit(this.flight);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(departureTime).getTime();
    const arrival = new Date(arrivalTime).getTime();

    if (Number.isNaN(departure) || Number.isNaN(arrival)) {
      return 'N/A';
    }

    let durationMinutes = Math.round((arrival - departure) / 60000);

    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours <= 0 && minutes <= 0) {
      return 'N/A';
    }

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }
}
