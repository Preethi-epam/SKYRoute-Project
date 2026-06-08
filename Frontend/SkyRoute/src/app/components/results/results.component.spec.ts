import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { Flight } from '../../models/flight.model';

const flights: Flight[] = [
  {
    id: 'F1',
    airline: 'Air A',
    departureTime: '2026-06-10T08:00:00Z',
    arrivalTime: '2026-06-10T10:00:00Z',
    departureAirport: 'Delhi',
    arrivalAirport: 'Mumbai',
    price: 8000,
    stops: 1,
    availableSeats: 10,
  },
  {
    id: 'F2',
    airline: 'Air B',
    departureTime: '2026-06-10T07:30:00Z',
    arrivalTime: '2026-06-10T08:30:00Z',
    departureAirport: 'Delhi',
    arrivalAirport: 'Mumbai',
    price: 6000,
    stops: 0,
    availableSeats: 6,
  },
  {
    id: 'F3',
    airline: 'Air C',
    departureTime: '2026-06-10T09:00:00Z',
    arrivalTime: '2026-06-10T12:30:00Z',
    departureAirport: 'Delhi',
    arrivalAirport: 'Mumbai',
    price: 10000,
    stops: 0,
    availableSeats: 3,
  },
];

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    component.flights = [...flights];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort by price low to high by default', () => {
    component.selectedSort = 'price';
    component.applyFilters();

    expect(component.filteredFlights.map((f) => f.id)).toEqual(['F2', 'F1', 'F3']);
  });

  it('should sort by price high to low', () => {
    component.selectedSort = 'priceDesc';
    component.applyFilters();

    expect(component.filteredFlights.map((f) => f.id)).toEqual(['F3', 'F1', 'F2']);
  });

  it('should sort by earliest departure first', () => {
    component.selectedSort = 'departure';
    component.applyFilters();

    expect(component.filteredFlights.map((f) => f.id)).toEqual(['F2', 'F1', 'F3']);
  });

  it('should sort by shortest duration first', () => {
    component.selectedSort = 'duration';
    component.applyFilters();

    expect(component.filteredFlights.map((f) => f.id)).toEqual(['F2', 'F1', 'F3']);
  });

  it('should apply non-stop filter', () => {
    component.filterNonStop = true;
    component.applyFilters();

    expect(component.filteredFlights.length).toBe(2);
    expect(component.filteredFlights.every((f) => f.stops === 0)).toBe(true);
  });

  it('should emit selected flight', () => {
    let selected: Flight | null = null;
    component.flightSelected.subscribe((f) => {
      selected = f;
    });

    component.onFlightSelected(flights[0]);

    expect(selected).toEqual(flights[0]);
  });

  it('should return flight id from trackBy', () => {
    expect(component.trackByFlightId(0, flights[0])).toBe('F1');
  });
});
