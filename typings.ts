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


export type Flights = {
  url: string;
  flexible: string;
  logo: string | null;
  depart_time0: string;
  depart_airport0: string;
  depart_date0: string;
  duration0: string;
  stops0: string;
  destination_time0: string;
  destination_airport0: string;
  destination_date0: string;


  depart_time1: string;
  depart_airport1: string;
  depart_date1: string;
  duration1: string;
  stops1: string;
  destination_time1: string;
  destination_airport1: string;
  destination_date1: string;

  total_price: string;



  
  // rating_count: string | null;
};
export type FlightResult = {
  content: {
    flights: Flights[];
  };
};




