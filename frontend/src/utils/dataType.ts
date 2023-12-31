export interface Address {
  street: string;
  city: string;
  country: string;
}

export interface Bedroom {
  bedNum: number;
  bedType: string;
}

export interface ListingMetadata {
  bathroomNum: number;
  propertyType: string;
  totalBedNum: number;
  bedrooms: Bedroom[];
  amenities: string[];
  images?: string[];
}

export interface ListingSubmission {
  title: string;
  address: Address;
  price: number;
  thumbnail: string;
  metadata: ListingMetadata;
}

export interface Availability {
  start: string;
  end: string;
}

export interface Review {
  owner: string;
  text: string;
  rate: number;
  postedOn: string;
}

export interface Listing {
  id?: number; // Only in getAllListings response
  title: string;
  owner: string;
  address: Address;
  thumbnail: string;
  price: number;
  metadata: ListingMetadata;
  reviews: Review[];
  availability?: Availability[]; // Only in getListingDetails response
  published?: boolean; // Only in getListingDetails response
  postedOn?: string; // Only in getListingDetails response
}

export interface BookingCreateData {
  dateRange: Availability;
  totalPrice: number;
}

export interface Booking {
  id: number;
  listingId: number;
  owner: string;
  dateRange: Availability;
  totalPrice: number;
  status: string;
}
