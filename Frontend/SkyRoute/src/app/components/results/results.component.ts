import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Flight } from '../../models/flight.model';
import { FlightCardComponent } from '../shared/flight-card.component';

type SortOption = 'price' | 'priceDesc' | 'duration' | 'departure';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, FlightCardComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  @Input() flights: Flight[] = [];
  @Output() flightSelected = new EventEmitter<Flight>();

  selectedSort: SortOption = 'price';
  filterNonStop = false;
  filteredFlights: Flight[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.flights];

    if (this.filterNonStop) {
      filtered = filtered.filter((f) => f.stops === 0);
    }

    switch (this.selectedSort) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const durationA =
            new Date(a.arrivalTime).getTime() -
            new Date(a.departureTime).getTime();
          const durationB =
            new Date(b.arrivalTime).getTime() -
            new Date(b.departureTime).getTime();
          return durationA - durationB;
        });
        break;
      case 'departure':
        filtered.sort(
          (a, b) =>
            new Date(a.departureTime).getTime() -
            new Date(b.departureTime).getTime()
        );
        break;
    }

    this.filteredFlights = filtered;
  }

  onFlightSelected(flight: Flight) {
    this.flightSelected.emit(flight);
  }

  trackByFlightId(index: number, flight: Flight): string {
    return flight.id;
  }
}
