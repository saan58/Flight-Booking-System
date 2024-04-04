export type Listing = {
  url: string;
  title: string;
  rating: string | null;
  description: string;
  price: string;
  link: string;
  booking_metadata: string;
  rating_word: string;
  rating_count: string | null;
};

export type Result = {
  content: {
    listings: Listing[];
    total_listings: string;
  };
};

export type FlightResult = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  // Add other properties as needed
};




