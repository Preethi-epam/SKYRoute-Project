import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { vi } from 'vitest';
import { SearchComponent } from './search.component';
import { SearchRequest } from '../../models/flight.model';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when from or to is empty', () => {
    component.searchRequest.from = '';
    component.searchRequest.to = 'Mumbai';
    expect(component.isSearchValid()).toBe(false);

    component.searchRequest.from = 'Delhi';
    component.searchRequest.to = '';
    expect(component.isSearchValid()).toBe(false);
  });

  it('should be valid when from and to are selected', () => {
    component.searchRequest.from = 'Delhi';
    component.searchRequest.to = 'Mumbai';

    expect(component.isSearchValid()).toBe(true);
  });

  it('should auto-correct to airport when from equals to on from change', () => {
    component.searchRequest.from = 'Delhi';
    component.searchRequest.to = 'Delhi';

    component.onFromChange();

    expect(component.searchRequest.to).not.toBe('Delhi');
  });

  it('should auto-correct from airport when from equals to on to change', () => {
    component.searchRequest.from = 'Mumbai';
    component.searchRequest.to = 'Mumbai';

    component.onToChange();

    expect(component.searchRequest.from).not.toBe('Mumbai');
  });

  it('should restore criteria from input changes', () => {
    const criteria: SearchRequest = {
      from: 'Chennai',
      to: 'NewYork',
      departureDate: '2026-12-20',
      passengers: 2,
      cabinClass: 'business',
    };

    component.restoreCriteria = criteria;
    component.ngOnChanges({
      restoreCriteria: new SimpleChange(null, criteria, false),
    });

    expect(component.searchRequest).toEqual(criteria);
  });

  it('should emit search request and stop searching after delay', () => {
    vi.useFakeTimers();

    component.searchRequest = {
      from: 'Delhi',
      to: 'Mumbai',
      departureDate: '2026-11-10',
      passengers: 1,
      cabinClass: 'economy',
    };

    let emitted: SearchRequest | null = null;
    component.search.subscribe((req) => {
      emitted = req;
    });

    component.onSearch();
    expect(component.searching()).toBe(true);

    vi.advanceTimersByTime(500);

    expect(emitted).toEqual(component.searchRequest);
    expect(component.searching()).toBe(false);

    vi.useRealTimers();
  });
});
