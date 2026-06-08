import { Component, Output, EventEmitter, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchRequest } from '../../models/flight.model';
import { AIRPORTS } from '../../config/app.constants';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnChanges {
  @Output() search = new EventEmitter<SearchRequest>();
  @Input() restoreCriteria: SearchRequest | null = null;

  searching = signal(false);
  airports: string[] = [...AIRPORTS];
  cabinClasses: Array<'economy' | 'business' | 'first'> = [
    'economy',
    'business',
    'first',
  ];
  minDepartureDate: string = this.formatDateForInput(new Date());

  searchRequest: SearchRequest = {
    from: '',
    to: '',
    departureDate: this.formatDateForInput(new Date(Date.now() + 86400000)),
    passengers: 1,
    cabinClass: 'economy',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['restoreCriteria'] && this.restoreCriteria) {
      this.searchRequest = { ...this.restoreCriteria };
    }
  }

  isSearchValid(): boolean {
    return this.searchRequest.from !== '' && this.searchRequest.to !== '';
  }

  onFromChange() {
    if (this.searchRequest.from === this.searchRequest.to) {
      const nextTo = this.airports.find(
        (airport) => airport !== this.searchRequest.from
      );
      if (nextTo) {
        this.searchRequest.to = nextTo;
      }
    }
  }

  onToChange() {
    if (this.searchRequest.from === this.searchRequest.to) {
      const nextFrom = this.airports.find(
        (airport) => airport !== this.searchRequest.to
      );
      if (nextFrom) {
        this.searchRequest.from = nextFrom;
      }
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSearch() {
    this.searching.set(true);
    setTimeout(() => {
      this.search.emit(this.searchRequest);
      this.searching.set(false);
    }, 500);
  }
}
