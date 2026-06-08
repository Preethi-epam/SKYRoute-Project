export interface Flight {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  price: number;
  stops: number;
  availableSeats: number;
}

export interface SearchRequest {
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
  cabinClass: 'economy' | 'business' | 'first';
}

export interface Passenger {
  name: string;
  email: string;
  documentNumber: string;
}

export interface Booking {
  bookingId: string;
  flightId: string;
  passengers: Passenger[];
  totalPrice: number;
  bookedAt: string;
}

export interface BookingRequest {
  flightId: string;
  passengers: Passenger[];
}
