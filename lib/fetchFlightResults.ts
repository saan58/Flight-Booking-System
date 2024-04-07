import { SearchParams } from "@/app/FlightSearch/page";
import { FlightResult } from "@/typings";

export async function fetchFlightResults(searchParams: SearchParams) {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  // Prepare the URL based on the provided search parameters
  const url = new URL(searchParams.url);
  Object.keys(searchParams).forEach((key) => {
    if (key === "url" || key === "sourceCode") return;

    const value = searchParams[key as keyof SearchParams];

    if (typeof value === "string") {
      url.searchParams.append(key, value);
    }
  });

  console.log("Scraping flight search URL >>>", url.href);

  const body = {
    source: "universal",
    url: url.href,
    parse: true,
    render: "html",
    parsing_instructions: {
      flights:{
        _fns: [
          {
            _fn: "xpath_one",
            _args: [".//div[@data-testid='searchresults_card']/text()"]

            
          },
        ],
        _items: {
          flexible: {
            _fns: [
              {
                _fn: "xpath_one",
                // _args: [".//div[@data-testid='title']/text()"],
                _args: ["//*[@id='flight-card-0']/div/div/div[1]/div[1]/span/span"]
              },
            ],
          },
          logo: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                ".//*[@id='flight-card-0']/div/div/div[1]/div[2]/div[1]/div/div/div"
                  ,
                ],
              },
            ],
          },
          depart_time0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  ".//div[@data-testid='flight_card_segment_departure_time_0']/text()",
                ],
              },
            ],
          },
          depart_airport0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_departure_airport_0']/text()"],
              },
            ],
          },
          depart_date0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_departure_date_0']/text()"],

              },
            ],
          },
          duration0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_duration_0']/text()"],
              },
            ],
          },
          stops0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_stops_0']/text()"],

              },
              
            ],
          },
          destination_time0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_time_0']/text()"],
              },
            ],
          },
          destination_airport0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_airport_0']/text()"],

              },
            ],
          },
          destination_date0: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_date_0']/text()"],

              },
            ],
          },


          depart_time1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [
                  ".//div[@data-testid='flight_card_segment_departure_time_1']/text()",
                ],
              },
            ],
          },
          depart_airport1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_departure_airport_1']/text()"],
              },
            ],
          },
          depart_date1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_departure_date_1']/text()"],

              },
            ],
          },
          duration1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_duration_1']/text()"],
              },
            ],
          },
          stops1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_stops_1']/text()"],

              },
              
            ],
          },
          destination_time1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_time_1']/text()"],
              },
            ],
          },
          destination_airport1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_airport_1']/text()"],

              },
            ],
          },
          destination_date1: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_segment_destination_date_1']/text()"],

              },
            ],
          },

          total_price: {
            _fns: [
              {
                _fn: "xpath_one",
                _args: [".//div[@data-testid='flight_card_price_total_price']/text()"],

              },
            ],
          },
          
          
        
        },

      },
    },
  };

  const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
    method: "POST",
    body: JSON.stringify(body),
    next: {
      revalidate: 60 * 60, // cache for 1 hour
    },
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        console.log("No flight results found");
        return null; // Return null or appropriate value
      }

      const result: FlightResult = data.results[0];

      return result;
    })
    .catch((err) => {
      // Handle fetch or parsing errors
      console.error("Error fetching flight results:", err);
      return null; // Return null or appropriate value
    });

    // return response ? [response] : null;
    return response;
}