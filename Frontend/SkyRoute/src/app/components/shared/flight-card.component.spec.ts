import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlightCardComponent } from './flight-card.component';
import { Flight } from '../../models/flight.model';

const mockFlight: Flight = {
  id: 'F1',
  airline: 'Sky Air',
  departureTime: '2026-07-10T08:00:00Z',
  arrivalTime: '2026-07-10T10:30:00Z',
  departureAirport: 'Delhi',
  arrivalAirport: 'Mumbai',
  price: 7000,
  stops: 0,
  availableSeats: 12,
};

describe('FlightCardComponent', () => {
  let component: FlightCardComponent;
  let fixture: ComponentFixture<FlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightCardComponent);
    component = fixture.componentInstance;
    component.flight = mockFlight;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected flight on select', () => {
    let selected: Flight | null = null;
    component.selected.subscribe((flight) => {
      selected = flight;
    });

    component.onSelect();

    expect(selected).toEqual(mockFlight);
  });

  it('should format duration with hours and minutes', () => {
    const duration = component.formatDuration(
      '2026-07-10T08:00:00Z',
      '2026-07-10T10:30:00Z'
    );

    expect(duration).toBe('2h 30m');
  });

  it('should format exact hour duration without minutes', () => {
    const duration = component.formatDuration(
      '2026-07-10T08:00:00Z',
      '2026-07-10T10:00:00Z'
    );

    expect(duration).toBe('2h');
  });

  it('should handle overnight durations', () => {
    const duration = component.formatDuration(
      '2026-07-10T23:00:00Z',
      '2026-07-10T01:00:00Z'
    );

    expect(duration).toBe('2h');
  });

  it('should return N/A for invalid date values', () => {
    expect(component.formatDuration('bad', '2026-07-10T01:00:00Z')).toBe('N/A');
  });

  it('should return N/A for zero duration', () => {
    expect(
      component.formatDuration('2026-07-10T10:00:00Z', '2026-07-10T10:00:00Z')
    ).toBe('N/A');
  });

  it('should format time string', () => {
    const time = component.formatTime('2026-07-10T08:15:00Z');

    expect(time.length).toBeGreaterThan(0);
  });
});
